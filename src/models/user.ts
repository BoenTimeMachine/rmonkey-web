import { IDocument } from "./document";
import { Nominal } from "tslang";

export type UserId = Nominal<string, "user-id">;

export interface User extends IDocument {
  id: UserId;
  account: string;
  password: string;
  group: string;
}
