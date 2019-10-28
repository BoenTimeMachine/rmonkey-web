import { IDocument } from "./document";
import { UserId } from "./user";

export interface Message extends IDocument {
  user: UserId;
  time: string;
  data: string[];
}
