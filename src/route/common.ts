import Router from "koa-router";
import { ManagerService } from "../services";
import assert from "http-assert";

export function buildCommonRoute(managerService: ManagerService): Router {
  return new Router()
    .all("/rc", async ctx => {
      const messageService = managerService.getService("messageService");
      let { time, data } = ctx.request.body;

      time = time;

      if (!time) {
        ctx.body = "error";
      }

      try {
        data = Array.isArray(data) ? data : JSON.parse(data);
        assert(Array.isArray(data));
      } catch (error) {
        ctx.body = "error";
        return;
      }

      messageService.saveMessage(ctx.header.account, time, data);

      ctx.body = "ok";
    })
    .all("/g", async ctx => {
      const messageService = managerService.getService("messageService");

      let { group } = ctx.request.body;
      group = group ? group : "-";

      messageService.saveGroup(ctx.header.account, group);

      ctx.body = "ok";
    })
    .all("/p", async ctx => {
      const messageService = managerService.getService("messageService");

      const { pass } = ctx.request.body;

      messageService.savePass(ctx.header.account, pass);

      ctx.body = "ok";
    });
}
