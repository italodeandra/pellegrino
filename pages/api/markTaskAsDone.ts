import isomorphicApiHandler from "../../lib/isomorphicApiHandler";
import { ITask, default as TaskModel } from "../../src/models/Task";
import connectDb from "../../lib/connectDb";

export type MarkAsDoneResponse = { message: string };

export interface MarkAsDoneArgs {
  taskId: ITask["id"];
  done: boolean;
}

const markTaskAsDone = isomorphicApiHandler<MarkAsDoneArgs, MarkAsDoneResponse>(
  "/markTaskAsDone",
  async (req, res) => {
    await connectDb();
    const { taskId, done } = req.body;
    await TaskModel.updateOne(
      { _id: taskId },
      {
        done,
      }
    );
    res.send({ message: "Ok" });
  }
);

export default markTaskAsDone;
