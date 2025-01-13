import { InMemoryUserRepository, UserRepository } from '../repositories/userRepository';
import { UserRegistrationService } from '../application/userRegistrationService';
import { UserRegistrationController } from './userRegistrationController';
import { createRouter, createServer } from './server';

export class Factory {
  private static userRepository: UserRepository;

  static getUserRepository() {
    if (this.userRepository == null) {
      this.userRepository = new InMemoryUserRepository();
    }
    return this.userRepository;
  }

  static createUserRegisterController() {
    const service = new UserRegistrationService(this.getUserRepository());
    return new UserRegistrationController(service);
  }

  static createServer() {
    return createServer(createRouter(this.createUserRegisterController()));
  }
}
