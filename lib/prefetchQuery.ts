import { QueryClient } from "react-query";

export default function prefetchQuery<Schema>(
  queryClient: QueryClient,
  schema: Schema,
  queryFn: (schema: Schema) => void
) {
  const schemaAny = schema as any;
  return queryClient.prefetchQuery(
    [schemaAny?.model, schemaAny?.method, schemaAny?.args],
    () => queryFn(schema)
  );
}
