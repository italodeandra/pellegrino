import socket from "@italodeandra/pijama/next/socket";
import {
  badRequest,
  internalServerError,
  notFound,
} from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useMutation, useQueryClient } from "react-query";
import { UseMutationOptions } from "react-query/types/react/types";
import axios from "../../../src/axios";
import ITask from "../../../src/collections/task/Task.interface";
import { updateTask } from "../../../src/collections/task/Task.repository";
import { invalidadeTasksQueriesEvent } from "./findTasks";

export type UpdateTaskArgs = Pick<ITask, "_id"> & Partial<ITask>;

export type UpdateTaskResponse = number;

const handler: NextApiHandler<UpdateTaskResponse> = async (req, res) => {
  try {
    const { _id, description, done }: UpdateTaskArgs = req.body;

    if (!_id) {
      return badRequest(res);
    }

    const updatedCount = await updateTask({ _id, description, done });

    if (!updatedCount) {
      return notFound(res);
    }

    socket.emit(invalidadeTasksQueriesEvent);

    res.json(updatedCount);
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
