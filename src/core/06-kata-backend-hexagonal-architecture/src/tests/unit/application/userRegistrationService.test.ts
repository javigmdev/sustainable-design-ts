import { InMemoryUserRepository, UserRepository } from '../../../core/repositories/userRepository';
import { Email } from '../../../core/valueObjects/email';
import { UserRegistrationRequest } from '../../../core/application/dtos';
import { UserRegistrationService } from '../../../core/application/userRegistrationService';

describe('The User Registration Service', () => {
  let userRepository: UserRepository;
  let userRegistrationService: UserRegistrationService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userRegistrationService = new UserRegistrationService(userRepository);
  });

  it('register a new user successfuly when given registration request is valid', async () => {
    await userRegistrationService.register(createRegistrationRequest());

    const expectedEmail = Email.create(createRegistrationRequest().email);
    const foundUser = await userRepository.findByEmail(expectedEmail);
    expect(foundUser.isMatchingEmail(expectedEmail)).toBe(true);
  });

  it('does not allow to register an user when a one with the same email already exists', async () => {
    await userRegistrationService.register(createRegistrationRequest());

    await expect(userRegistrationService.register(createRegistrationRequest())).rejects.toThrow(
      'User already exists with this email'
    );
  });
});

function createRegistrationRequest() {
  const registrationRequest: UserRegistrationRequest = {
    email: 'test@example.com',
    password: 'TestPass123_',
  };
  return registrationRequest;
}
