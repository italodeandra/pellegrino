import socket from "@italodeandra/pijama/next/socket";
import { internalServerError } from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useEffect } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
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

const queryKeys = ["task", "findTasks"];

export const prefetchFindTasks = (queryClient: QueryClient) =>
  queryClient.prefetchQuery([...queryKeys, ""], () => findTasks());

export const invalidadeTaskQueriesEvent = "invalidateQueries/task";

export const useFindTasks = (search: FindTasksArgs["search"] = "") => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleInvalidadeTasksQueriesEvent = () => {
      void queryClient.invalidateQueries([queryKeys[0]]);
    };
    socket.on(invalidadeTaskQueriesEvent, handleInvalidadeTasksQueriesEvent);
    return () => {
      socket.off(invalidadeTaskQueriesEvent, handleInvalidadeTasksQueriesEvent);
    };
  }, [queryClient]);

  return useQuery([...queryKeys, search], () =>
    axios
      .get<FindTasksResponse>(`/api/${queryKeys.join("/")}`, {
        params: { search },
      })
      .then((res) => res.data)
  );
};
