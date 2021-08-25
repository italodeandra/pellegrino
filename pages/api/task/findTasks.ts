import { internalServerError } from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useEffect } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import socket from "@italodeandra/pijama/next/socket";
import axios from "../../../src/axios";
import ITask from "../../../src/collections/task/Task.interface";
import { findTasks } from "../../../src/collections/task/Task.repository";

export type FindTasksArgs = {
  search?: string;
};

export type FindTasksResponse = ITask[];

const handler: NextApiHandler<FindTasksResponse> = async (req, res) => {
  try {
    const { search }: FindTasksArgs = req.query;

    const tasks = await findTasks(search);

    res.json(tasks);
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

// noinspection JSUnusedGlobalSymbols
export default handler;

const queryKey = "findTasks";

export const prefetchFindTasks = (queryClient: QueryClient) =>
  queryClient.prefetchQuery(["tasks", queryKey, ""], () => findTasks());

export const invalidadeTasksQueriesEvent = "invalidateQueries/tasks";

export const useFindTasks = (search?: FindTasksArgs["search"]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleInvalidadeTasksQueriesEvent = () => {
      void queryClient.invalidateQueries(["tasks"]);
    };
    socket.on(invalidadeTasksQueriesEvent, handleInvalidadeTasksQueriesEvent);
    return () => {
      socket.off(
        invalidadeTasksQueriesEvent,
        handleInvalidadeTasksQueriesEvent
      );
    };
  }, [queryClient]);

  return useQuery(["tasks", queryKey, search], () =>
    axios
      .get<FindTasksResponse>(`/api/task/${queryKey}`, { params: { search } })
      .then((res) => res.data)
  );
};
