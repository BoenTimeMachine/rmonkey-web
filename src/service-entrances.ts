import {
  APIService,
  DBService,
  HttpService,
  SocketService,
  MessageService,
  AuthService,
  ManagerService
} from "./services";
import { config } from "./config";
import { buildRoutes } from "./route";

export type Services = {
  apiService: APIService;
  authService: AuthService;
  dbService: DBService;
  httpService: HttpService;
  socketService: SocketService;
  messageService: MessageService;
};

export const managerService = new ManagerService();

export const apiService = new APIService();

export const dbService = new DBService(config.mongo);

const router = buildRoutes(managerService);

export const httpService = new HttpService(router, config.http);

export const authService = new AuthService(dbService, config.auth);

export const socketService = new SocketService(
  httpService,
  authService,
  config.socket
);

export const messageService = new MessageService(socketService, dbService);
