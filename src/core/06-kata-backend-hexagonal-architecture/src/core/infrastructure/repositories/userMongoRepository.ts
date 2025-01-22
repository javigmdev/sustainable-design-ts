import { UserRepository } from '../../repositories/userRepository';
import { Db, MongoClient } from 'mongodb';
import { User } from '../../entities/user';
import { Email } from '../../valueObjects/email';
import { Maybe } from '../../common/monads/maybe';
import { Id } from '../../valueObjects/id';

type UserDto = { id: string; email: string; password: string };

export class UserMongoRepository implements UserRepository {
  private readonly collectionName = 'users';

  constructor(private readonly database: Db) {}

  async findAll(): Promise<User[]> {
    const collection = this.database.collection(this.collectionName);
    const dtos = await collection.find<UserDto>({}).toArray();
    return dtos.map((dto) => User.fromDto(dto));
  }

  async findByEmail(email: Email): Promise<Maybe<User>> {
    const collection = this.database.collection(this.collectionName);
    const userDto = await collection.findOne<UserDto>({ email: email.toString() });
    return userDto ? Maybe.just(User.fromDto(userDto)) : Maybe.nothing<User>();
  }

  async findById(id: Id): Promise<Maybe<User>> {
    const collection = this.database.collection(this.collectionName);
    const userDto = await collection.findOne<UserDto>({ id: id.toString() });
    return userDto ? Maybe.just(User.fromDto(userDto)) : Maybe.nothing<User>();
  }

  async remove(user: User): Promise<void> {
    const collection = this.database.collection(this.collectionName);
    await collection.deleteOne({ id: user.toDto().id.toString() });
  }

  async save(user: User): Promise<void> {
    const collection = this.database.collection(this.collectionName);
    const userDto = user.toDto();
    const foundUser = await collection.findOne<UserDto>({ id: userDto.id });
    foundUser ? await collection.updateOne({ id: userDto.id }, { $set: userDto }) : await collection.insertOne(userDto);
  }
}

export async function connectWithDatabase(connectionString: string, dbName: string) {
  const client = new MongoClient(connectionString);
  await client.connect();
  return client.db(dbName);
}
