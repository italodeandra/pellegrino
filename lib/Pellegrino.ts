import { Model, MongooseDocumentMiddleware } from "mongoose"
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
} from "react-query/types/react/types"

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T

type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : T

// @ts-ignore
export type Pellegrino<SchemaDefinitionType = any> = {
  name: string
  hooks: { [key: string]: (hook: MongooseDocumentMiddleware, doc: any) => void }
  create: Model<SchemaDefinitionType>["create"]
  updateOne: Model<SchemaDefinitionType>["updateOne"]
  find: Model<SchemaDefinitionType>["find"]
  useQuery: <Method extends keyof Model<SchemaDefinitionType>>(
    method: Method,
    ...args: Parameters<Model<SchemaDefinitionType>[Method]>
  ) => UseQueryResult<Await<ReturnType<Model<SchemaDefinitionType>[Method]>>>
  useSubscription: <Method extends keyof Model<SchemaDefinitionType>>(
    method: Method,
    ...args: Parameters<Model<SchemaDefinitionType>[Method]>
  ) => UseQueryResult<Await<ReturnType<Model<SchemaDefinitionType>[Method]>>>
  useMutation: <Method extends keyof Model<SchemaDefinitionType>>(
    method: Method,
    options?: UseMutationOptions<
      Await<ReturnType<Model<SchemaDefinitionType>[Method]>>
    >
  ) => Omit<
    UseMutationResult<Await<ReturnType<Model<SchemaDefinitionType>[Method]>>>,
    "mutate"
  > & {
    mutate: Model<SchemaDefinitionType>[Method]
  }
}
