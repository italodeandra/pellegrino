import { isBrowser } from "@italodeandra/pijama/utils/isBrowser";
import {
  DocumentDefinition,
  Model,
  model,
  models,
  Schema,
  SchemaDefinition,
  SchemaOptions,
} from "mongoose";

export default function createModel<SchemaDefinitionType>(
  name: string,
  definition: SchemaDefinition<DocumentDefinition<SchemaDefinitionType>>,
  options?: SchemaOptions
): Model<SchemaDefinitionType> {
  if (isBrowser) {
    return null as never;
  }

  if (models[name]) {
    return models[name];
  }

  const schema = new Schema(definition, options);

  return model(name, schema);
}
