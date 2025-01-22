import { Email } from '../../valueObjects/email';
import { Id } from '../../valueObjects/id';
import { User } from '../../entities/user';
import fs from 'node:fs';
import { UserRepository } from '../../repositories/userRepository';
import { Maybe } from '../../common/monads/maybe';
import path from 'node:path';

export class UserFileRepository implements UserRepository {
  private constructor(private readonly path: string) {}

  static create(filename: string): UserRepository {
    const basePath = path.resolve(__dirname, '../../../data', filename);
    if (!fs.existsSync(basePath)) {
      fs.writeFileSync(basePath, '[]', 'utf8');
    }
    return new UserFileRepository(basePath);
  }

  async findAll(): Promise<User[]> {
    return this.readUsersFromFile();
  }

  async findByEmail(email: Email): Promise<Maybe<User>> {
    const users = this.readUsersFromFile();
    const user = users.find((u: User) => u.isMatchingEmail(email));
    return Maybe.of(user);
  }

  async findById(id: Id): Promise<Maybe<User>> {
    const users = this.readUsersFromFile();
    const user = users.find((u: User) => u.isMatchingId(id));
    return Maybe.of(user);
  }

  async remove(user: User): Promise<void> {
    let users = this.readUsersFromFile();
    users = users.filter((u: User) => !u.isEquals(user));
    this.writeUsersToFile(users);
  }

  async save(user: User): Promise<void> {
    const users = await this.findAll();
    const index = users.findIndex((u) => u.isEquals(user));
    const notFoundIndex = -1;
    index === notFoundIndex ? users.push(user) : (users[index] = user);
    this.writeUsersToFile(users);
  }

  private readUsersFromFile() {
    const usersDTO = JSON.parse(fs.readFileSync(this.path, 'utf8'));
    return usersDTO.map((dto) => User.fromDto(dto));
  }

  private writeUsersToFile(users: User[]) {
    const usersDto = users.map((user) => user.toDto());
    fs.writeFileSync(this.path, JSON.stringify(usersDto), 'utf8');
  }
}
