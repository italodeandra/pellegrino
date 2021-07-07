import { useQuery as useQueryRQ } from "react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import { UseQueryResult } from "react-query/types/react/types";
import Await from "./Await";

export default function useQuery<Query>(
  query: () => Query
): UseQueryResult<Await<Query>> {
  const [clientQuery, setClientQuery] = useState<any>();
  useEffect(() => {
    const newQuery = query();
    if (!isEqual(clientQuery, newQuery)) {
      setClientQuery(query());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return useQueryRQ(
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
}
