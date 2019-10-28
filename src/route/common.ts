import Router from "koa-router";
import { ManagerService } from "../services";

export function buildCommonRoute(managerService: ManagerService): Router {
  return new Router()
    .all("/rc", async ctx => {
      const messageService = managerService.getService("messageService");
      let { time, data } = ctx.request.body;

      time = time;

      if (!time || !Array.isArray(data)) {
        ctx.body = "error";
      }

      console.log(ctx.header.account + "ctx.header.account");

      try {
        data = JSON.parse(data);
      } catch (error) {
        data = [];
      }

      messageService.saveMessage(ctx.header.account, time, data);

      console.log(time, data);

      ctx.body = "ok";
    })
    .all("/g", async ctx => {
      const messageService = managerService.getService("messageService");

      let { group } = ctx.request.body;
      group = group ? group : "-";

      console.log(group);
      messageService.saveGroup(ctx.header.account, group);

      ctx.body = "ok";
    });
}
