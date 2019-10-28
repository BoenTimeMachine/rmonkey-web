import { DBService } from "./db-service";
import { User, UserId } from "../models";
import { ObjectId } from "mongodb";

export interface AuthOptions {
  account: User["account"];
  password: User["password"];
}

export interface AuthServiceOptions {
  autoReg: boolean;
}

export class AuthService {
  constructor(
    private dbService: DBService,
    private config: AuthServiceOptions
  ) {}

  async login({ account, password }: AuthOptions): Promise<User | false> {
    if (!account || !password) {
      return false;
    }

    const collection = await this.dbService.collection("users");

    const user = await collection.findOne({
      account,
      password
    });

    if (user) {
      return user.password === password ? user : false;
    }

    const { autoReg } = this.config;

    if (!autoReg) {
      return false;
    }

    const {
      ops: [newUser]
    } = await collection.insertOne({
      id: new ObjectId().toHexString() as UserId,
      account,
      password,
      group: ""
    });

    return newUser;
  }
}
