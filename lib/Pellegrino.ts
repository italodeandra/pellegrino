import { Model } from "mongoose";
import { NextApiHandler } from "next";
import connectDb from "./connectDb";
import { unauthorized } from "@italodeandra/pijama/server/apiErrors";
import checkPermissions, { Permissions } from "./checkPermissions";
import merge from "lodash/merge";
import mapValues from "lodash/mapValues";
import { USER_ROLE, USER_ID } from "./user";

const deeplyMap = (obj: any, mapFn: (value: any) => any): any => {
  return typeof obj === "object"
    ? Array.isArray(obj)
      ? obj.map((item) =>
          typeof item === "object" ? deeplyMap(item, mapFn) : mapFn(item)
        )
      : mapValues(obj, (item) =>
          typeof item === "object" ? deeplyMap(item, mapFn) : mapFn(item)
        )
    : mapFn(obj);
};

const Pellegrino =
  (
    models: { [key: string]: Model<any> },
    permissions?: Permissions
  ): NextApiHandler =>
  async (req, res) => {
    const modelName = req.query.model as string;
    const method = req.query.method as string;
    const model: any = models[modelName];
    let args = req.body;
    permissions = merge(permissions || {}, model._pellegrino_permissions);
    const user = await permissions?.auth?.(req);
    const hasPermission = await checkPermissions(
      permissions,
      req,
      user,
      modelName,
      method,
      args
    );
    if (hasPermission) {
      args = deeplyMap(args, (value) =>
        value === USER_ID
          ? user?.id || "none"
          : value === USER_ROLE
          ? user?.role || "anonymous"
          : value
      );

      await connectDb();

      const data = await model[method](...args);
      res.send(data);
    } else {
      unauthorized(res);
    }
  };

// noinspection JSUnusedGlobalSymbols
export default Pellegrino;
