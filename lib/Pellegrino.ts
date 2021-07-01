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

export interface Pellegrino<SchemaDefinitionType = any> {
  aggregate: Model<SchemaDefinitionType>["aggregate"]
  create: Model<SchemaDefinitionType>["create"]
  find: Model<SchemaDefinitionType>["find"]
  hooks: { [key: string]: (hook: MongooseDocumentMiddleware, doc: any) => void }
  name: string
  updateMany: Model<SchemaDefinitionType>["update"]
  updateOne: Model<SchemaDefinitionType>["updateOne"]
  upsert: Model<SchemaDefinitionType>["findOneAndUpdate"]
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
  useQuery: <Method extends keyof Model<SchemaDefinitionType>>(
    method: Method,
    ...args: Parameters<Model<SchemaDefinitionType>[Method]>
  ) => UseQueryResult<Await<ReturnType<Model<SchemaDefinitionType>[Method]>>>

  useSubscription<Method extends keyof Model<SchemaDefinitionType>>(
    method: "aggregate",
    pipeline: any[]
  ): UseQueryResult<Await<ReturnType<Model<SchemaDefinitionType>[Method]>>>

  useSubscription<Method extends keyof Model<SchemaDefinitionType>>(
    method: Method,
    ...args: Parameters<Model<SchemaDefinitionType>[Method]>
  ): UseQueryResult<Await<ReturnType<Model<SchemaDefinitionType>[Method]>>>
}
