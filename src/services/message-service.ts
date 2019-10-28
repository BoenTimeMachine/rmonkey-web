import { Socket } from "socket.io";

import { SocketService, SocketEventListener } from "./socket-service";
import { DBService } from "./db-service";
import { Message, UserId } from "../models";

export interface MessageSendOptions {
  content: string;
  to?: UserId;
}

export interface MessageInChatOptions {
  to: UserId;
}

export class MessageService {
  constructor(
    private socketService: SocketService,
    private dbService: DBService
  ) {
    this.initialize();
  }

  on(event: string, listener: SocketEventListener): MessageService {
    this.socketService.register(`msg:${event}`, listener);
    return this;
  }

  async saveMessage(
    account: string,
    time: string,
    data: string[]
  ): Promise<void> {
    const user = this.socketService.accountToUserMap.get(account);

    const socket = user && this.socketService.userToSocketMap.get(user);

    if (!socket) {
      return;
    }

    const collection = await this.dbService.collection("messages");

    collection.insertOne({
      user: user!.id,
      time,
      data
    });

    socket.emit("msg", { time, data });
  }

  async saveGroup(account: string, group: string): Promise<void> {
    const user = this.socketService.accountToUserMap.get(account);

    const socket = user && this.socketService.userToSocketMap.get(user);

    if (!socket) {
      return;
    }

    const uc = await this.dbService.collection("users");

    uc.updateOne(
      {
        id: user!.id
      },
      {
        $set: {
          group
        }
      }
    );

    socket.emit("group", { group });
  }

  sendMessage(socket: Socket, message: Message): void {
    socket.emit("msg:send", message);
  }

  private async initialize(): Promise<void> {
    this.on("change-user", this.onChangeUser)
      .on("list", this.onGetList)
      .on("history", this.onGetHistory);
  }

  private onChangeUser: SocketEventListener = async (
    socket,
    data: MessageSendOptions,
    callback
  ): Promise<void> => {
    if (!callback) {
      return;
    }

    // const now = new Date();

    // const info = this.socketService.getSocketInfoWithLogged(socket);

    // if (!info) {
    //   return callback(false);
    // }

    // try {
    //   const {
    //     user: { id: from, inChatUser }
    //   } = info;

    //   const { content, to = inChatUser } = data;

    //   if (!to) {
    //     return callback(false);
    //   }

    //   const usersCollection = this.dbService.collection("users");

    //   const { value: user } = await usersCollection.findOneAndUpdate(
    //     buildUserFilterQuery(to),
    //     buildUpdateQuery(from, content)
    //   );

    //   if (!user) {
    //     return;
    //   }

    //   const messagesCollection = this.dbService.collection("messages");

    //   const {
    //     ops: [newMessage]
    //   } = await messagesCollection.insertOne({
    //     _id: new ObjectId(),
    //     from,
    //     to,
    //     content,
    //     unread: true,
    //     createAt: now
    //   });

    //   await usersCollection.findOneAndUpdate(
    //     buildUserFilterQuery(from),
    //     buildUpdateQuery(to, content)
    //   );

    //   if (inChatUser) {
    //     const inChatUserSocket = this.socketService.userToSocketMap.get(
    //       inChatUser
    //     )!;

    //     this.sendMessage(inChatUserSocket, newMessage);
    //   }

    //   callback(true);
    // } catch (error) {
    //   callback(false);
    //   return;
    // }
  };

  private onGetHistory: SocketEventListener = async (): Promise<void> => {
    // const info = this.socketService.getSocketInfoWithLogged(socket);
    // if (!info) {
    //   return;
    // }
    // const newInfo = _.clone(info);
    // newInfo.user.inChatUser = undefined;
    // this.socketService.updateSocketInfo(socket.id as SocketId, newInfo);
  };

  private onGetList: SocketEventListener = async (): Promise<void> => {
    //   const info = this.socketService.getSocketInfoWithLogged(socket);
    //   if (!info) {
    //     return;
    //   }
    //   const newInfo = _.clone(info);
    //   newInfo.user.inChatUser = undefined;
    //   this.socketService.updateSocketInfo(socket.id as SocketId, newInfo);
  };
}
