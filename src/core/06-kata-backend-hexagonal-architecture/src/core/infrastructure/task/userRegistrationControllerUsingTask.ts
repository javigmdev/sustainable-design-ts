import { UserRegistrationServiceUsingTask } from '../../application/task/userRegistrationServiceUsingTask';
import { HttpRequest, HttpResponse } from '../http';
import { UserRegistrationRequest, UserRegistrationResponse } from '../../application/dtos';
import { ValidationError } from '../../common/validationError';
import { Task } from '../../common/monads/task';

export class UserRegistrationControllerUsingTask {
  constructor(private service: UserRegistrationServiceUsingTask) {}

  register = (
    request: HttpRequest<UserRegistrationRequest>,
    response: HttpResponse<UserRegistrationResponse>
  ): void => {
    try {
      this.ensureThatEmailAndPasswordAreProvided(request);
      this.handleRegistration(request).run(
        (registrationResponse) => response.status(201).json(registrationResponse),
        (error) => this.handleErrors(error, response)
      );
    } catch (error) {
      this.handleErrors(error, response);
    }
  };

  private ensureThatEmailAndPasswordAreProvided(request: HttpRequest<UserRegistrationRequest>) {
    if (!request.body.email || !request.body.password) {
      throw new ValidationError('Email and password are required');
    }
  }

  private handleRegistration(request: HttpRequest<UserRegistrationRequest>): Task<UserRegistrationResponse> {
    return this.service.register(request.body);
  }

  private handleErrors(error: ValidationError, response: HttpResponse<UserRegistrationResponse>) {
    if (error instanceof ValidationError) {
      response.status(400).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
