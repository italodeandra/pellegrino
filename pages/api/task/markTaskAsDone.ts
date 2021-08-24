import {
  badRequest,
  internalServerError,
  notFound,
} from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useMutation, useQueryClient } from "react-query";
import connectDb from "../../../lib/connectToDatabase";
import socket from "../../../lib/socket";
import axios from "../../../src/axios";
import Task, { ITask } from "../../../src/models/Task";
import { invalidadeTasksQueriesEvent } from "./findTasks";

export type MarkTaskAsDoneArgs = Pick<ITask, "_id" | "done">;

export type MarkTaskAsDoneResponse = ITask["_id"];

const handler: NextApiHandler<MarkTaskAsDoneResponse> = async (req, res) => {
  try {
    await connectDb();

    const { _id, done }: MarkTaskAsDoneArgs = req.body;

    if (!_id) {
      return badRequest(res);
    }

    const task = await Task.findOneAndUpdate(
      { _id },
      {
        done,
      }
    );

    if (!task) {
      return notFound(res);
    }

    socket.emit(invalidadeTasksQueriesEvent);

    res.json(task._id);
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

// noinspection JSUnusedGlobalSymbols
export default handler;

const mutationKey = "markTaskAsDone";

export const useMarkTaskAsDone = () => {
  const queryClient = useQueryClient();
  return useMutation<MarkTaskAsDoneResponse, unknown, MarkTaskAsDoneArgs>(
    ["tasks", mutationKey],
    (args) =>
      axios
        .post<MarkTaskAsDoneResponse>(`/api/task/${mutationKey}`, args)
        .then((res) => res.data),
    {
      onSuccess() {
        void queryClient.invalidateQueries(["tasks"]);
      },
    }
  );
};
