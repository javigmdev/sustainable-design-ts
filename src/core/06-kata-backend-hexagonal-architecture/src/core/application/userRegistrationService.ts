import { UserRepository } from '../repositories/userRepository';
import { UserRegistrationRequest, UserRegistrationResponse } from './dtos';
import { Email } from '../valueObjects/email';
import { ValidationError } from '../common/validationError';
import { Id } from '../valueObjects/id';
import { Password } from '../valueObjects/password';
import { User } from '../entities/user';

export class UserRegistrationService {
  constructor(private userRepository: UserRepository) {}

  async register(registrationRequest: UserRegistrationRequest): Promise<UserRegistrationResponse> {
    await this.ensureThatUserDoesNotExists(registrationRequest);
    const user = this.createUser(registrationRequest);
    await this.userRepository.save(user);
    return user.toDto();
  }

  private async ensureThatUserDoesNotExists(registrationRequest: UserRegistrationRequest) {
    const user = await this.userRepository.findByEmail(Email.create(registrationRequest.email));
    user.tap(() => {
      throw new ValidationError('User already exists with this email');
    });
  }

  private createUser(registrationRequest: UserRegistrationRequest) {
    const id = Id.generateUniqueIdentificer();
    const email = Email.create(registrationRequest.email);
    const password = Password.createFromPlainText(registrationRequest.password);
    return new User(id, email, password);
  }
}
