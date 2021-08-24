import { internalServerError } from "@italodeandra/pijama/server/apiErrors";
import { NextApiHandler } from "next";
import { useEffect } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import connectDb from "../../../lib/connectToDatabase";
import socket from "../../../lib/socket";
import axios from "../../../src/axios";
import Task, { ITask } from "../../../src/models/Task";

export type FindTasksArgs = {
  search?: string;
};

export type FindTasksResponse = ITask[];

export const findTasks = async ({ search = "" }: FindTasksArgs) =>
  await Task.find({
    description: { $options: "i", $regex: search },
  }).lean();

const handler: NextApiHandler<FindTasksResponse> = async (req, res) => {
  try {
    await connectDb();

    const { search }: FindTasksArgs = req.query;

    const tasks = await findTasks({ search });

    res.json(tasks);
  } catch (e) {
    console.error(e);
    internalServerError(res);
  }
};

export default handler;

const queryKey = "findTasks";

export const prefetchFindTasks = (queryClient: QueryClient) =>
  queryClient.prefetchQuery(["tasks", queryKey, ""], () => findTasks({}));

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
