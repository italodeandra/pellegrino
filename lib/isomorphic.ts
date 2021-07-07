import { Model } from "mongoose";
import { isServer } from "@italodeandra/pijama/utils/isBrowser";

export function isomorphic<TModel extends Model<any>>(
  name: string,
  model: () => TModel
): TModel {
  return isServer
    ? model()
    : (new Proxy(
        {},
        {
          get: function (target, prop) {
            return (...args: any) => {
              const method = prop;
              return {
                model: name,
                method,
                args,
              };
            };
          },
        }
      ) as any);
}
