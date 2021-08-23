import {
  badRequest,
  internalServerError,
} from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useMutation, useQueryClient } from "react-query";
import { UseMutationOptions } from "react-query/types/react/types";
import connectDb from "../../../lib/connectDb";
import socket from "../../../lib/socket";
import axios from "../../../src/axios";
import Task, { ITask } from "../../../src/models/Task";
import { invalidadeTasksQueriesEvent } from "./findTasks";

export type CreateTaskArgs = Pick<ITask, "description">;

export type CreateTaskResponse = ITask["_id"];

const handler: NextApiHandler<CreateTaskResponse> = async (req, res) => {
  try {
    await connectDb();

    const { description }: CreateTaskArgs = req.body;

    if (!description) {
      return badRequest(res);
    }

    const task = await Task.create({
      description,
    });

    socket.emit(invalidadeTasksQueriesEvent);

    res.json(task._id);
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

// noinspection JSUnusedGlobalSymbols
export default handler;

const mutationKey = "createTask";

export const useCreateTask = <
  TData = CreateTaskResponse,
  TError = unknown,
  TVariables = CreateTaskArgs,
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
