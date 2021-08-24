import {
  badRequest,
  internalServerError,
  notFound,
} from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useMutation, useQueryClient } from "react-query";
import { UseMutationOptions } from "react-query/types/react/types";
import connectDb from "../../../lib/connectToDatabase";
import socket from "../../../lib/socket";
import axios from "../../../src/axios";
import Task, { ITask } from "../../../src/models/Task";
import { invalidadeTasksQueriesEvent } from "./findTasks";

export type UpdateTaskArgs = Pick<ITask, "_id" | "description">;

export type UpdateTaskResponse = ITask["_id"];

const handler: NextApiHandler<UpdateTaskResponse> = async (req, res) => {
  try {
    await connectDb();

    const { _id, description }: UpdateTaskArgs = req.body;

    if (!_id || !description) {
      return badRequest(res);
    }

    const task = await Task.findOneAndUpdate(
      { _id },
      {
        description,
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

const mutationKey = "updateTask";

export const useUpdateTask = <
  TData = UpdateTaskResponse,
  TError = unknown,
  TVariables = UpdateTaskArgs,
  TContext = unknown
>(
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
  const queryClient = useQueryClient();
  return useMutation<TData, TError, TVariables, TContext>(
    ["tasks", mutationKey],
    (args) =>
      axios
        .post<TData>(`/api/task/${mutationKey}`, args)
        .then((res) => res.data),
    {
      ...options,
      async onSuccess(...props) {
        if (options?.onSuccess) {
          await options.onSuccess(...props);
        }
        await queryClient.invalidateQueries(["tasks"]);
      },
    }
  );
};
