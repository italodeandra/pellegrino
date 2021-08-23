import createModel from "../../lib/createModel";

export interface ITask {
  _id: string;
  description: string;
  done?: boolean;
}

const Task = createModel<ITask>("Task", {
  description: { required: true, type: String },
  done: { default: false, required: true, type: Boolean },
});

export default Task;
