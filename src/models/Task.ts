import { Schema, Model, models, model, Document } from "mongoose";
import setupSchemaHooks from "../../lib/setupSchemaHooks";
import { isomorphic } from "../../lib/isomorphic";

const name = "Task";

export interface ITask extends Document {
  description: string;
  done?: boolean;
}

const Task: Model<ITask> = isomorphic(name, () => {
  const schema = new Schema<ITask>({
    description: { required: true, type: String },
    done: { default: false, required: true, type: Boolean },
  });

  setupSchemaHooks(name, schema);

  return models[name] || model(name, schema);
});

export default Task;
