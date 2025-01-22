import { UserRepositoryUsingTask } from '../../repositories/task/userRepositoryUsingTask';
import { UserRegistrationRequest, UserRegistrationResponse } from '../dtos';
import { Task } from '../../common/monads/task';
import { Email } from '../../valueObjects/email';
import { ValidationError } from '../../common/validationError';
import { Either } from '../../common/monads/either';
import { User } from '../../entities/user';
import { Id } from '../../valueObjects/id';
import { Password } from '../../valueObjects/password';

export class UserRegistrationServiceUsingTask {
  constructor(private userRepository: UserRepositoryUsingTask) {}

  register(registrationRequest: UserRegistrationRequest): Task<UserRegistrationResponse> {
    return this.userRepository.findByEmail(Email.create(registrationRequest.email)).flatMap((maybeUser) =>
      maybeUser.fold(
        () => this.registerNewUser(registrationRequest),
        () => this.notifyExistingUser()
      )
    );
  }

  private registerNewUser(registrationRequest: UserRegistrationRequest) {
    return this.createUserSafe(registrationRequest.email, registrationRequest.password)
      .toTask()
      .flatMap((user) => this.userRepository.save(user).map(() => user.toDto()));
  }

  private notifyExistingUser() {
    return Task.rejected(new ValidationError('User already exists with this email'));
  }

  private createUserSafe(email: string, password: string): Either<ValidationError, User> {
    const id = Id.generateUniqueIdentificer();
    const safeEmail = Email.createSafe(email);
    const safePassword = Password.createSafe(password);
    return safeEmail.flatMap((email) => safePassword.map((password) => new User(id, email, password)));
  }
}
