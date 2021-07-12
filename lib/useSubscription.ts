import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import useUpdate from "react-use/lib/useUpdate";
import socketIOClient, { Socket } from "socket.io-client";
import useQuery from "./useQuery";
import isEqual from "lodash/isEqual";
import { UseQueryResult, UseQueryOptions } from "react-query/types/react/types";
import Await from "./Await";
import { AxiosInstance } from "axios";

export default function useSubscription<Query>(
  query: () => Query,
  options?: UseQueryOptions<Await<Query>> & { axios?: AxiosInstance }
): UseQueryResult<Await<Query>> {
  const [clientQuery, setClientQuery] = useState<any>();
  useEffect(() => {
    const newQuery = query();
    if (!isEqual(clientQuery, newQuery)) {
      setClientQuery(query());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const update = useUpdate();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket>();
  useEffect(() => {
    const socket = (socketRef.current = socketIOClient());
    socket.on("disconnect", update);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);
  useEffect(() => {
    if (clientQuery?.model) {
      const socket = socketRef.current!;
      socket.offAny();
      socket.emit("subscribe", clientQuery.model);
      socket.on("refetch", async () => {
        await queryClient.refetchQueries([clientQuery.model]);
      });
    }
  }, [clientQuery?.model, queryClient]);
  return useQuery(query as () => Query, options);
}
