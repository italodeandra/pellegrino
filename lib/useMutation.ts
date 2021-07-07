import { useMutation as useMutationRQ } from "react-query";
import axios from "axios";
import Await from "./Await";
import { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";

export default function useMutation<Query>(query: () => Query) {
  const [clientQuery, setClientQuery] = useState<any>();
  useEffect(() => {
    const newQuery = query();
    if (!isEqual(clientQuery, newQuery)) {
      setClientQuery(query());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const mutation = useMutationRQ<Await<Query>>(
    [clientQuery?.model, clientQuery?.method, clientQuery?.args],
    () =>
      clientQuery
        ? axios
            .post(
              `/api/query?model=${clientQuery.model}&method=${clientQuery.method}`,
              clientQuery.args
            )
            .then((res) => res.data)
        : new Promise(() => {})
  );
  return {
    ...mutation,
    mutate: mutation.mutate as () => void,
  };
}
