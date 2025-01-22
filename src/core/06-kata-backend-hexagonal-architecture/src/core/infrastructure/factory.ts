import { InMemoryUserRepository, UserRepository } from '../repositories/userRepository';
import { UserRegistrationService } from '../application/userRegistrationService';
import { UserRegistrationController } from './userRegistrationController';
import { createRouter, createServer } from './server';
import { Db } from 'mongodb';
import { connectWithDatabase } from './repositories/userMongoRepository';

export class Factory {
  private static userRepository: UserRepository;

  private static dataBase: Db;

  static async initialize() {
    this.dataBase = await connectWithDatabase('mongodb://localhost:27017', 'test');
  }

  static getUserRepository() {
    if (this.userRepository == null) {
      this.userRepository = new InMemoryUserRepository();
      // this.userRepository = UserFileRepository.create('users.json');
      // this.userRepository = new UserMongoRepository(this.dataBase);
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
