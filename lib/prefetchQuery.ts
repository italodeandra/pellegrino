import { QueryClient } from "react-query";

export default function prefetchQuery<Schema>(
  queryClient: QueryClient,
  schema: Schema,
  queryFn: (schema: Schema) => void
) {
  let schemaAny = schema as any;
  schemaAny = schemaAny.model ? schemaAny : schemaAny.pellegrinoSchema;
  return queryClient.prefetchQuery(
    [schemaAny?.model, schemaAny?.method, schemaAny?.args],
    () => queryFn(schema)
  );
}
