import { UserRegistrationControllerUsingTask } from './userRegistrationControllerUsingTask';
import express, { Express, Request, Response, Router } from 'express';
import { Routes } from '../routes';

export function createRouter(userRegistrationController: UserRegistrationControllerUsingTask) {
  const router = Router();
  router.get(Routes.status, (request: Request, response: Response) => response.status(200).json({ status: 'OK' }));
  router.post(Routes.register, userRegistrationController.register);
  return router;
}

export function createServer(router: Router): Express {
  const server = express();
  server.use(express.json());
  server.use(router);
  return server;
}
