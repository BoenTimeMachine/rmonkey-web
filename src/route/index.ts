import Router from "koa-router";
import { buildCommonRoute } from "./common";
import { ManagerService } from "../services";
import { ObjectId } from "mongodb";
import { UserId } from "../models";

export function buildRoutes(managerService: ManagerService): Router {
  return new Router()
    .all("*", async (ctx, next) => {
      const dbService = managerService.getService("dbService");
      const token = ctx.header.authorization;

      console.log(token);

      if (!token) {
        return;
      }

      let [account, password = "123456"] = String(token).split("::::");

      if (!account) {
        return;
      }

      account = account;
      password = password;

      const collection = await dbService!.collection("users");

      const user = await collection.findOne({
        account
      });

      if (user) {
        if (user.password !== password) {
          return;
        }
        // 正常
      } else {
        // 注册个新的
        collection.insertOne({
          id: new ObjectId().toHexString() as UserId,
          account,
          password,
          group: ""
        });
      }

      if (!user) {
        // return;
      }

      ctx.header.account = account;

      await next();
    })
    .use(buildCommonRoute(managerService).routes());
}
