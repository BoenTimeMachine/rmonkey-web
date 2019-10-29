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

      if (!token) {
        return;
      }

      const [account, password] = String(token).split("::::");

      if (!account || !password) {
        return;
      }

      const collection = await dbService!.collection("users");

      const user = await collection.findOne({
        account
      });

      if (user) {
        if (user.password !== password) {
          // 暂不限制
          // return;
        }
      } else {
        // 注册个新的
        await collection.insertOne({
          id: new ObjectId().toHexString() as UserId,
          account,
          password,
          group: ""
        });
      }

      ctx.header.account = account;

      await next();
    })
    .use(buildCommonRoute(managerService).routes());
}
