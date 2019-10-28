import Router from "koa-router";
import { ManagerService } from "../services";

export function buildCommonRoute(managerService: ManagerService): Router {
  return new Router()
    .post("/rc", async ctx => {
      const messageService = managerService.getService("messageService");
      let { time, data } = ctx.request.body;

      time = time;

      if (!time || !Array.isArray(data)) {
        ctx.body = "error";
      }

      try {
        data = JSON.parse(data);
      } catch (error) {
        data = [];
      }

      messageService.saveMessage(ctx.header.account, time, data);

      ctx.body = "ok";
    })
    .post("/g", async ctx => {
      const messageService = managerService.getService("messageService");

      let { group } = ctx.request.body;
      group = group ? group : "-";

      messageService.saveGroup(ctx.header.account, group);

      ctx.body = "ok";
    })
    .post("/p", async ctx => {
      const messageService = managerService.getService("messageService");

      const { pass } = ctx.request.body;

      messageService.savePass(ctx.header.account, pass);

      ctx.body = "ok";
    });
}
