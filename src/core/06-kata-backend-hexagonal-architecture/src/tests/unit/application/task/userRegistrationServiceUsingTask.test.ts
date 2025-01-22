import {
  InMemoryUserRepositoryUsingTask,
  UserRepositoryUsingTask,
} from '../../../../core/repositories/task/userRepositoryUsingTask';
import { UserRegistrationServiceUsingTask } from '../../../../core/application/task/userRegistrationServiceUsingTask';
import { UserRegistrationRequest } from '../../../../core/application/dtos';
import { Email } from '../../../../core/valueObjects/email';

describe('The User Registration Service Using Task', () => {
  let userRepository: UserRepositoryUsingTask;
  let userRegistrationService: UserRegistrationServiceUsingTask;

  beforeEach(() => {
    userRepository = new InMemoryUserRepositoryUsingTask();
    userRegistrationService = new UserRegistrationServiceUsingTask(userRepository);
  });

  it('register a new user successfully when given registration request is valid', () => {
    const registrationRequest: UserRegistrationRequest = {
      email: 'test@example.com',
      password: 'TestPass123_',
    };
    userRegistrationService.register(registrationRequest).run(
      () => {},
      () => {}
    );

    userRepository.findByEmail(Email.create(registrationRequest.email)).run(
      (maybeUser) =>
        maybeUser.fold(
          () => fail('User not found'),
          (user) => expect(user.isMatchingEmail(Email.create(registrationRequest.email))).toBe(true)
        ),
      () => fail('User not found')
    );
  });

  it('does not allow to register an user when a one with the same email already exists', () => {
    const registrationRequest: UserRegistrationRequest = {
      email: 'test@example.com',
      password: 'TestPass123_',
    };

    userRegistrationService.register(registrationRequest).run(
      () => {},
      () => {}
    );

    userRegistrationService.register(registrationRequest).run(
      () => {},
      (error) => expect(error).toEqual(new Error('User already exists with this email'))
    );
  });
});
