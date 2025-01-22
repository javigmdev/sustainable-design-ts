import { UserRegistrationControllerUsingTask } from '../../../../core/infrastructure/task/userRegistrationControllerUsingTask';
import { InMemoryUserRepositoryUsingTask } from '../../../../core/repositories/task/userRepositoryUsingTask';
import { UserRegistrationServiceUsingTask } from '../../../../core/application/task/userRegistrationServiceUsingTask';
import { HttpRequest, HttpResponse } from '../../../../core/infrastructure/http';
import { UserRegistrationRequest, UserRegistrationResponse } from '../../../../core/application/dtos';

describe('The User Registration Controller Using Task ', () => {
  let controller: UserRegistrationControllerUsingTask;

  beforeEach(() => {
    controller = createController();
  });

  it('register a new user when email and password are valid', () => {
    const email = 'test@example.com';
    const request = createRequestBy(email);
    const response = createSpyResponse();

    controller.register(request, response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      id: expect.any(String),
      email,
      password: expect.any(String),
    });
  });

  it('rejects registration when email is not provided', () => {
    const request = createRequestBy(undefined);
    const response = createSpyResponse();

    controller.register(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  it('rejects registration when password is not provided', () => {
    const request = createRequestWithoutPassword('test@example.com');
    const response = createSpyResponse();

    controller.register(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });
});

function createController() {
  const repository = new InMemoryUserRepositoryUsingTask();
  const service = new UserRegistrationServiceUsingTask(repository);
  return new UserRegistrationControllerUsingTask(service);
}

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
