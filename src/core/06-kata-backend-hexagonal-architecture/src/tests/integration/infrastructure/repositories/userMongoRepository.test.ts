import { Db } from 'mongodb';
import { UserRepository } from '../../../../core/repositories/userRepository';
import { User } from '../../../../core/entities/user';
import { Email } from '../../../../core/valueObjects/email';
import { Maybe } from '../../../../core/common/monads/maybe';
import { Id } from '../../../../core/valueObjects/id';
import { Password } from '../../../../core/valueObjects/password';
import {
  connectWithDatabase,
  UserMongoRepository,
} from '../../../../core/infrastructure/repositories/userMongoRepository';

describe('The User Mongo Db Repository', () => {
  let database: Db;
  let repository: UserRepository;
  beforeEach(async () => {
    const dbName = 'test';
    const connectionString = 'mongodb://localhost:27017';
    database = await connectWithDatabase(connectionString, dbName);
    repository = new UserMongoRepository(database);
  });

  afterEach(async () => {
    await database.dropDatabase();
  });

  it('finds no users when the repository is empty ', async () => {
    const users = await repository.findAll();

    expect(users).toEqual([]);
  });

  it('finds all users when the repository is not empty', async () => {
    const user = createUserByEmail(Email.create('test@example.com'));

    await repository.save(user);
    const users = await repository.findAll();

    expect(users).toEqual([user]);
  });

  it('does not find a non-existing user by email', async () => {
    const email = Email.create('test@example.com');

    const maybeUser = await repository.findByEmail(email);

    expect(maybeUser).toEqual(Maybe.nothing<User>());
  });

  it('finds an existing user by email', async () => {
    const email = Email.create('test@example.com');
    const user = createUserByEmail(email);
    await repository.save(user);

    const maybeUser = await repository.findByEmail(email);

    expect(maybeUser).toEqual(Maybe.just(user));
  });

  it('does not find a non-existing user by id', async () => {
    const id = Id.generateUniqueIdentificer();

    const maybeUser = await repository.findById(id);

    expect(maybeUser).toEqual(Maybe.nothing<User>());
  });

  it('finds an existing user by id', async () => {
    const id = Id.generateUniqueIdentificer();
    const user = createUserById(id);
    await repository.save(user);

    const maybeUser = await repository.findById(id);

    expect(maybeUser).toEqual(Maybe.just(user));
  });

  it('removes a user', async () => {
    const email = Email.create('test@example.com');
    const user = createUserByEmail(email);
    await repository.save(user);

    await repository.remove(user);

    const maybeUser = await repository.findByEmail(email);
    expect(maybeUser).toEqual(Maybe.nothing());
  });

  it('updates an existing user', async () => {
    const email = Email.create('test@example.com');
    const user = createUserByEmail(email);
    await repository.save(user);
    user.changePassword(Password.createFromPlainText('NewPass123_'));
    await repository.save(user);

    const users = await repository.findAll();
    expect(users).toEqual([user]);
  });
});

function createUserByEmail(email: Email) {
  const id = Id.generateUniqueIdentificer();
  const password = Password.createFromPlainText('TestPass123_');
  return new User(id, email, password);
}

function createUserById(id: Id) {
  const password = Password.createFromPlainText('TestPass123_');
  const email = Email.create('test@example.com');
  return new User(id, email, password);
}
