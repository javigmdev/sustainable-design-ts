import { Password } from '../../../../core/valueObjects/password';
import { Email } from '../../../../core/valueObjects/email';
import { Id } from '../../../../core/valueObjects/id';
import { User } from '../../../../core/entities/user';
import { InMemoryUserRepository, UserRepository } from '../../../../core/repositories/userRepository';
import { Maybe } from '../../../../core/common/monads/maybe';

describe('The In Memory User Repository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it('finds a user by ID ', async () => {
    const id = Id.generateUniqueIdentificer();
    const user = createUserById(id);
    await repository.save(user);

    const foundUser = await repository.findById(id);
    foundUser.fold(
      () => fail('User not found'),
      (u) => expect(u).toEqual(user)
    );
  });

  it('does not find a non-existing user by ID ', async () => {
    const id = Id.generateUniqueIdentificer();

    const foundUser = await repository.findById(id);
    expect(foundUser).toEqual(Maybe.nothing());
  });

  it('finds a user by Email ', async () => {
    const email = Email.create('test@example.com');
    const user = createUserByEmail(email);
    await repository.save(user);

    const foundUser = await repository.findByEmail(email);
    foundUser.fold(
      () => fail('User not found'),
      (u) => expect(u).toEqual(user)
    );
  });

  it('does not find a non-existing user by Email ', async () => {
    const email = Email.create('test@example.com');

    const foundUser = await repository.findByEmail(email);

    expect(foundUser).toEqual(Maybe.nothing());
  });

  it('finds all users', async () => {
    const user = createUserByEmail(Email.create('test@example.com'));
    const anotherUser = createUserByEmail(Email.create('anotherTest@example.com'));
    await repository.save(user);
    await repository.save(anotherUser);

    const users = await repository.findAll();

    expect(users).toEqual([user, anotherUser]);
    expect(users).toHaveLength(2);
  });

  it('finds no users when the repository is empty', async () => {
    const users = await repository.findAll();

    expect(users).toEqual([]);
    expect(users).toHaveLength(0);
  });

  it('updates an user when its already exists', async () => {
    const user = createUserByEmail(Email.create('test@example.com'));
    const sameUser = user;
    await repository.save(user);
    await repository.save(sameUser);

    const users = await repository.findAll();

    expect(users).toEqual([user]);
    expect(users).toHaveLength(1);
  });

  it('removes and user', async () => {
    const email = Email.create('test@example.com');
    const user = createUserByEmail(email);
    await repository.save(user);

    await repository.remove(user);

    const foundUser = await repository.findByEmail(email);

    expect(foundUser).toEqual(Maybe.nothing());
  });
});

function createUserById(id: Id) {
  const password = Password.createFromPlainText('TestPass123_');
  const email = Email.create('test@example.com');
  return new User(id, email, password);
}

function createUserByEmail(email: Email) {
  const id = Id.generateUniqueIdentificer();
  const password = Password.createFromPlainText('TestPass123_');
  return new User(id, email, password);
}
