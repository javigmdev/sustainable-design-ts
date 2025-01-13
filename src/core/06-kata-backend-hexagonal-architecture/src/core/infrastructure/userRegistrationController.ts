import { UserRegistrationService } from '../application/userRegistrationService';
import { HttpRequest, HttpResponse } from './http';
import { UserRegistrationRequest, UserRegistrationResponse } from '../application/dtos';
import { ValidationError } from '../common/validationError';

export class UserRegistrationController {
  constructor(private service: UserRegistrationService) {}

  register = async (
    request: HttpRequest<UserRegistrationRequest>,
    response: HttpResponse<UserRegistrationResponse>
  ): Promise<void> => {
    try {
      this.ensureThatEmailAndPasswordAreProvided(request);
      await this.handleRegistration(request, response);
    } catch (error) {
      this.handleErrors(error, response);
    }
  };

  private ensureThatEmailAndPasswordAreProvided(request: HttpRequest<UserRegistrationRequest>) {
    if (!request.body.email || !request.body.password) {
      throw new ValidationError('Email and password are required');
    }
  }

  private async handleRegistration(
    request: HttpRequest<UserRegistrationRequest>,
    response: HttpResponse<UserRegistrationResponse>
  ) {
    const registrationResponse = await this.service.register(request.body);
    response.status(201).json(registrationResponse);
  }

  private handleErrors(error: ValidationError, response: HttpResponse<UserRegistrationResponse>) {
    if (error instanceof ValidationError) {
      response.status(400).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
