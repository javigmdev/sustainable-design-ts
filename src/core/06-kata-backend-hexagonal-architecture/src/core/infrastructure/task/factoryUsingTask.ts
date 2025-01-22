import {
  InMemoryUserRepositoryUsingTask,
  UserRepositoryUsingTask,
} from '../../repositories/task/userRepositoryUsingTask';
import { Db } from 'mongodb';
import { connectWithDatabase } from '../repositories/userMongoRepository';
import { UserRegistrationServiceUsingTask } from '../../application/task/userRegistrationServiceUsingTask';
import { UserRegistrationControllerUsingTask } from './userRegistrationControllerUsingTask';
import { createRouter, createServer } from './serverUsingTask';

export class FactoryUsingTask {
  private static userRepositoryTask: UserRepositoryUsingTask;

  private static dataBase: Db;

  static async initialize() {
    this.dataBase = await connectWithDatabase('mongodb://localhost:27017', 'test');
  }

  static getUserRepository() {
    if (this.userRepositoryTask == null) {
      this.userRepositoryTask = new InMemoryUserRepositoryUsingTask();
    }
    return this.userRepositoryTask;
  }

  static createUserRegisterController() {
    const service = new UserRegistrationServiceUsingTask(this.getUserRepository());
    return new UserRegistrationControllerUsingTask(service);
  }

  static createServerTask() {
    return createServer(createRouter(this.createUserRegisterController()));
  }
}
