import { Document } from "mongoose";
import isomorphicModel from "../../lib/isomorphicModel";

export interface ITask extends Document {
  description: string;
  done?: boolean;
}

const Task = isomorphicModel<ITask>(
  "Task",
  {
    description: { required: true, type: String },
    done: { default: false, required: true, type: Boolean },
  },
  {
    access: {
      "*": {
        find: true,
        create: true,
        updateOne: true,
      },
    },
    presets: {
      "*": {
        find: [{}, "description done"],
      },
    },
  }
);

export default Task;
