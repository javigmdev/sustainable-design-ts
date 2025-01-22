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
    const { email, password } = registrationRequest;
    const maybeExistingUser = await this.userRepository.findByEmail(Email.create(registrationRequest.email));
    maybeExistingUser.tap(() => {
      throw new ValidationError('User already exists with this email');
    });

    const id = Id.generateUniqueIdentificer();
    const user = new User(id, Email.create(email), Password.createFromPlainText(password));
    await this.userRepository.save(user);
    return {
      id: id.toString(),
      email: email,
    };
  }
}
