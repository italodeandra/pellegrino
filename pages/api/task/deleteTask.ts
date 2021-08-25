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
import { deleteTask } from "../../../src/collections/task/Task.repository";
import { invalidadeTasksQueriesEvent } from "./findTasks";

export type DeleteTaskArgs = Pick<ITask, "_id">;

export type DeleteTaskResponse = void;

const handler: NextApiHandler<DeleteTaskResponse> = async (req, res) => {
  try {
    const { _id }: DeleteTaskArgs = req.body;

    if (!_id) {
      return badRequest(res);
    }

    await deleteTask(_id);

    socket.emit(invalidadeTasksQueriesEvent);

    res.json();
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

// noinspection JSUnusedGlobalSymbols
export default handler;

const mutationKey = "deleteTask";

export const useDeleteTask = <
  TData = DeleteTaskResponse,
  TError = unknown,
  TVariables = DeleteTaskArgs,
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
