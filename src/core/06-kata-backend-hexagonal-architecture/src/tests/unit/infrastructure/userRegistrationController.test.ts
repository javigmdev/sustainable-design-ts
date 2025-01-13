import { InMemoryUserRepository } from '../../../core/repositories/userRepository';
import { UserRegistrationService } from '../../../core/application/userRegistrationService';
import { UserRegistrationRequest, UserRegistrationResponse } from '../../../core/application/dtos';
import { HttpRequest, HttpResponse } from '../../../core/infrastructure/http';
import { UserRegistrationController } from '../../../core/infrastructure/userRegistrationController';

describe('The User Registration Controller', () => {
  let controller: UserRegistrationController;

  beforeEach(() => {
    controller = createController();
  });

  it('register a new user when email and password are valid', async () => {
    const email = 'test@example.com';
    const request = createRequestBy(email);
    const response = createSpyResponse();

    await controller.register(request, response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({ id: expect.any(String), email });
  });

  it('rejects registration when email is not provided', async () => {
    const request = createRequestBy(undefined);
    const response = createSpyResponse();

    await controller.register(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  it('rejects registration when password is not provided', async () => {
    const request = createRequestWithoutPassword('test@example.com');
    const response = createSpyResponse();

    await controller.register(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });
});

function createRequestBy(email: string) {
  const password = 'TestPass123_';
  return {
    body: {
      email,
      password,
    },
  };
}

function createRequestWithoutPassword(email: string) {
  return {
    body: {
      email,
    },
  } as HttpRequest<UserRegistrationRequest>;
}

function createSpyResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as HttpResponse<UserRegistrationResponse>;
}

function createController() {
  const repository = new InMemoryUserRepository();
  const service = new UserRegistrationService(repository);
  return new UserRegistrationController(service);
}
