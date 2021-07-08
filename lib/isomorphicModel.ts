import {
  Model,
  Schema,
  model as createModel,
  SchemaDefinition,
  Document,
  models,
  SchemaOptions,
} from "mongoose";
import { isServer } from "@italodeandra/pijama/utils/isBrowser";
import setupSchemaHooks from "./setupSchemaHooks";
import { ModelPermissions } from "./checkPermissions";

export default function isomorphicModel<
  TDocument extends Document,
  TDefinition extends SchemaDefinition<TDocument> = SchemaDefinition<TDocument>,
  TModel extends Model<TDocument> = Model<TDocument>
>(name: string, schema: TDefinition, permissions?: ModelPermissions): TModel;
export default function isomorphicModel<
  TDocument extends Document,
  TDefinition extends SchemaDefinition<TDocument> = SchemaDefinition<TDocument>,
  TModel extends Model<TDocument> = Model<TDocument>
>(name: string, model: () => TModel, permissions?: ModelPermissions): TModel;
export default function isomorphicModel<
  TDocument extends Document,
  TDefinition extends SchemaDefinition<TDocument> = SchemaDefinition<TDocument>,
  TModel extends Model<TDocument> = Model<TDocument>
>(
  name: string,
  schema: TDefinition,
  schemaOptions?: SchemaOptions,
  permissions?: ModelPermissions
): TModel;
export default function isomorphicModel(
  name: any,
  schemaOrModel: any,
  permissionsOrOptions?: any,
  permissions?: any
): any {
  if (!permissions) {
    permissions = permissionsOrOptions;
    permissionsOrOptions = undefined;
  }
  const getModel = () => {
    let model: any;

    if (typeof schemaOrModel === "function") {
      model = schemaOrModel();
    } else if (models[name]) {
      model = models[name];
    } else {
      const schema = new Schema(schemaOrModel, permissionsOrOptions);
      setupSchemaHooks(name, schema);
      model = createModel(name, schema);
    }

    if (permissions) {
      model._pellegrino_permissions = {
        access: {
          [name]: permissions.access,
        },
        presets: {
          [name]: permissions.presets,
        },
      };
    }

    return model;
  };

  return isServer
    ? getModel()
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
