import socket from "@italodeandra/pijama/api/socket";
import {
  badRequest,
  internalServerError,
} from "@italodeandra/pijama/api/errors";
import { NextApiHandler } from "next";
import { useMutation, useQueryClient } from "react-query";
import { UseMutationOptions } from "react-query/types/react/types";
import axios from "../../../src/axios";
import ITask from "../../../src/collections/task/Task.interface";
import { insertTask } from "../../../src/collections/task/Task.repository";
import { invalidadeTaskQueriesEvent } from "./findTasks";

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

    socket.emit(invalidadeTaskQueriesEvent);

    res.json(taskId);
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

// noinspection JSUnusedGlobalSymbols
export default handler;

const mutationKeys = ["task", "insertTask"];

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
    [...mutationKeys],
    (args) =>
      axios
        .post<TData>(`/api/${mutationKeys.join("/")}`, args)
        .then((res) => res.data),
    {
      ...options,
      async onSuccess(...props) {
        if (options?.onSuccess) {
          await options.onSuccess(...props);
        }
        await queryClient.invalidateQueries([mutationKeys[0]]);
      },
    }
  );
};
