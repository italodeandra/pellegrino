import {
  badRequest,
  internalServerError,
} from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useMutation, useQueryClient } from "react-query";
import { UseMutationOptions } from "react-query/types/react/types";
import socket from "@italodeandra/pijama/next/socket";
import axios from "../../../src/axios";
import ITask from "../../../src/collections/task/Task.interface";
import { insertTask } from "../../../src/collections/task/Task.repository";
import { invalidadeTasksQueriesEvent } from "./findTasks";

export type CreateTaskArgs = Pick<ITask, "description">;

export type CreateTaskResponse = ITask["_id"];

const handler: NextApiHandler<CreateTaskResponse> = async (req, res) => {
  try {
    const { description }: CreateTaskArgs = req.body;

    if (!description) {
      return badRequest(res);
    }

    const taskId = await insertTask({
      description,
    });

    socket.emit(invalidadeTasksQueriesEvent);

    res.json(taskId);
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

// noinspection JSUnusedGlobalSymbols
export default handler;

const mutationKey = "insertTask";

export const useInsertTask = <
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
