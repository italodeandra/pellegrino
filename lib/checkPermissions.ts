import { NextApiRequest } from "next";
import merge from "lodash/merge";

export interface ModelPermissions {
  presets?: {
    [key: string]: {
      [key: string]: any[];
    };
  };
  access?: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
}

export interface Permissions {
  presets?: {
    [key: string]: {
      [key: string]: {
        [key: string]: any[];
      };
    };
  };
  access?: {
    [key: string]: {
      [key: string]: {
        [key: string]: boolean;
      };
    };
  };

  auth?(req: NextApiRequest): { role: string; [key: string]: any };
}

export default function checkPermissions(
  permissions: Permissions | undefined,
  req: NextApiRequest,
  user: any,
  modelName: string,
  method: string,
  args: any[] = []
) {
  if (permissions?.presets) {
    if (permissions.presets?.[modelName]) {
      let preset: any[] = permissions.presets[modelName]?.["*"]?.[method];
      if (preset) {
        preset.forEach((arg, i) => {
          if (typeof arg === "string") {
            args[i] = `${args[i] || ""} ${preset[i]}`;
          } else {
            args[i] = merge(args[i], preset[i]);
          }
        });
      }

      const role = user?.role || "anonymous";
      preset = permissions.presets[modelName]?.[role]?.[method];
      if (preset) {
        preset.forEach((arg, i) => {
          if (typeof arg === "string") {
            args[i] = `${args[i] || ""} ${preset[i]}`;
          } else {
            args[i] = merge(args[i], preset[i]);
          }
        });
      }
    }
  }

  if (permissions) {
    if (permissions.access?.[modelName]) {
      if (
        permissions.access[modelName]?.["*"]?.["*"] ||
        permissions.access[modelName]?.["*"]?.[method]
      ) {
        return true;
      }

      user = user || permissions.auth?.(req);
      const role = user?.role || "anonymous";
      // noinspection RedundantIfStatementJS
      if (
        permissions.access[modelName]?.[role]?.["*"] ||
        permissions.access[modelName]?.[role]?.[method]
      ) {
        return true;
      }

      return false;
    }
  }
  return true;
}
