import { Id } from '../../valueObjects/id';
import { Task } from '../../common/monads/task';
import { Maybe } from '../../common/monads/maybe';
import { User } from '../../entities/user';
import { Email } from '../../valueObjects/email';

export interface UserRepositoryUsingTask {
  findById(id: Id): Task<Maybe<User>>;

  findByEmail(email: Email): Task<Maybe<User>>;

  findAll(): Task<User[]>;

  save(user: User): Task<void>;

  remove(user: User): Task<void>;
}

export class InMemoryUserRepositoryUsingTask implements UserRepositoryUsingTask {
  private users: User[] = [];

  findById(id: Id): Task<Maybe<User>> {
    return Task.of(Maybe.of(this.users.find((user) => user.isMatchingId(id))));
  }

  findByEmail(email: Email): Task<Maybe<User>> {
    return Task.of(Maybe.of(this.users.find((user) => user.isMatchingEmail(email))));
  }

  findAll(): Task<User[]> {
    return Task.of(this.users);
  }

  save(user: User): Task<void> {
    return Task.fromTry(() => {
      const index = this.users.findIndex((u) => u.isEquals(user));
      const notFoundIndex = -1;
      index === notFoundIndex ? this.users.push(user) : (this.users[index] = user);
    });
  }

  remove(user: User): Task<void> {
    return Task.fromTry(() => {
      this.users = this.users.filter((u) => !u.isEquals(user));
    });
  }
}
