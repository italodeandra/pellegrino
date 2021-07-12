import { useMutation as useMutationRQ } from "react-query";
import axios from "./axios";
import Await from "./Await";
import { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import { UseMutationOptions } from "react-query/types/react/types";
import { AxiosInstance } from "axios";

export default function useMutation<Query>(
  query: () => Query,
  options?: UseMutationOptions<Await<Query>> & { axios?: AxiosInstance }
) {
  const [clientQuery, setClientQuery] = useState<any>();
  useEffect(() => {
    const newQuery = query();
    if (!isEqual(clientQuery, newQuery)) {
      setClientQuery(query());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const mutation = useMutationRQ<Await<Query>>(
    [
      clientQuery?.route ? clientQuery?.route : clientQuery?.model,
      clientQuery?.method,
      clientQuery?.args,
    ],
    () =>
      clientQuery
        ? (options?.axios || axios)
            .post(
              clientQuery.route
                ? `/api${clientQuery.route}`
                : `/api/query?model=${clientQuery.model}&method=${clientQuery.method}`,
              clientQuery.args
            )
            .then((res) => res.data)
        : new Promise(() => {}),
    options
  );
  return {
    ...mutation,
    mutate: mutation.mutate as () => void,
  };
}
