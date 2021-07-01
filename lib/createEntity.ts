import type {
  DocumentDefinition,
  FilterQuery,
  Model,
  Schema,
  SchemaDefinition,
} from "mongoose"
import { MongooseDocumentMiddleware, QueryOptions } from "mongoose"
import socketIOClient, { Socket } from "socket.io-client"
import { useDeepCompareEffect, useUpdate } from "react-use"
import { useEffect, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import axios from "axios"
import { isServer } from "@italodeandra/pijama"
import { merge } from "lodash"
import { Pellegrino } from "./Pellegrino"
import { Server } from "socket.io"

declare global {
  namespace NodeJS {
    // noinspection JSUnusedGlobalSymbols
    interface Global {
      pellegrinos: Pellegrino[]
      io: Server
    }
  }
}

global.pellegrinos = []

export function createEntity<SchemaDefinitionType>(
  name: string,
  definition: SchemaDefinition<DocumentDefinition<SchemaDefinitionType>>
): Pellegrino<SchemaDefinitionType> {
  const existingPellegrino = global.pellegrinos.find(
    (pellegrino) => pellegrino.name === name
  )
  if (existingPellegrino) {
    return existingPellegrino
  }

  const pellegrinoModel = {
    promise: Promise.resolve(),
  } as unknown as {
    schema: Schema<SchemaDefinitionType>
    model: Model<SchemaDefinitionType>
    promise: Promise<void>
  }

  const hooks: Pellegrino<SchemaDefinitionType>["hooks"] = {}

  if (isServer) {
    const setServerProperties = async () => {
      const { model: createModel, Schema, models } = await import("mongoose")
      pellegrinoModel.schema = new Schema(definition)

      if (!global.io) {
        console.info(
          `Subscription disabled because socket.io is not available on global "global.io"`
        )
      } else {
        console.info(`Subscription enabled`)
        pellegrinoModel.schema.post("save", function (doc) {
          for (const [, hook] of Object.entries(hooks)) {
            hook("save", doc)
          }
        })

        pellegrinoModel.schema.post("updateOne", async function () {
          // @ts-ignore
          const updatedDoc = await this.model.findOne(this.getQuery())
          for (const [, hook] of Object.entries(hooks)) {
            hook("save", updatedDoc)
          }
        })

        global.io.on("connection", (socket) => {
          socket.on(
            "subscribe",
            (method: keyof Model<SchemaDefinitionType>, args: any) => {
              hooks[socket.id] = async (
                hook: MongooseDocumentMiddleware,
                doc: any
              ) => {
                args[0] = args[0] ? { ...args[0], _id: doc._id } : args[0]
                const found = await pellegrinoModel.model.findOne(...args)
                if (found) {
                  socket.emit(hook, found)
                } else {
                  socket.emit("remove", doc._id)
                }
              }
            }
          )

          socket.on("unsubscribe", () => {
            delete hooks[socket.id]
          })

          socket.on("disconnect", () => {
            delete hooks[socket.id]
          })
        })
      }

      pellegrinoModel.model =
        models[name] || createModel(name, pellegrinoModel.schema)
    }
    pellegrinoModel.promise = setServerProperties().catch(console.error)
  }

  const pellegrino: Pellegrino<SchemaDefinitionType> = {
    create: (async (...props: any) => {
      if (!isServer) {
        throw Error(`"create" can only be used from the server`)
      }
      await pellegrinoModel.promise
      return pellegrinoModel.model.create(...props)
    }) as any,
    find: (async (...props: any) => {
      if (!isServer) {
        throw Error(`"create" can only be used from the server`)
      }
      await pellegrinoModel.promise

      const filter: FilterQuery<Model<SchemaDefinitionType>> = props[0] || {}
      const projection: any | null | undefined = props[1]
      const options: QueryOptions | null | undefined = props[2]
      return pellegrinoModel.model.find(
        filter,
        "id " + projection,
        merge<typeof options, typeof options>(
          {
            // projection: "id",
          },
          options
        )
      )
    }) as any,
    hooks,
    name,
    updateOne: (async (...props: any) => {
      if (!isServer) {
        throw Error(`"updateOne" can only be used from the server`)
      }
      await pellegrinoModel.promise
      return pellegrinoModel.model.updateOne(...props)
    }) as any,
    useMutation: (method, options) => {
      const { mutate: originalMutate, ...mutation } = useMutation<
        any,
        unknown,
        any
      >(
        [name, method],
        (args) =>
          axios.post(`/api/${name}/${method}`, args).then((res) => res.data),
        options
      )

      const mutate: any = (...args: any) => {
        originalMutate(args)
      }

      return {
        ...mutation,
        mutate,
      }
    },
    // @ts-ignore
    useQuery: (method, ...args) => {
      return useQuery([name, method, args], () =>
        axios.post(`/api/${name}/${method}`, args).then((res) => res.data)
      )
    },
    // @ts-ignore
    useSubscription: (method, ...args) => {
      const update = useUpdate()
      const queryClient = useQueryClient()
      const socketRef = useRef<Socket>()
      useEffect(() => {
        const socket = (socketRef.current = socketIOClient())
        socket.on("disconnect", update)
        return () => {
          socket.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [update])
      useDeepCompareEffect(() => {
        const socket = socketRef.current!
        socket.emit("unsubscribe")
        socket.emit("subscribe", method, args)
        socket.on("save", (doc) => {
          const queryData =
            queryClient.getQueryData<any[]>([name, method, args]) || []
          let found = false
          for (const item of queryData) {
            if (item._id === doc._id) {
              found = true
              Object.assign(item, doc)
            }
          }
          if (!found) {
            queryData.push(doc)
          }
          queryClient.setQueryData([name, method, args], queryData)
        })
        socket.on("remove", (docId) => {
          const queryData =
            queryClient.getQueryData<any[]>([name, method, args]) || []
          queryClient.setQueryData(
            [name, method, args],
            queryData.filter((item) => item._id !== docId)
          )
        })
        return () => {
          socket.emit("unsubscribe")
        }
      }, [method, args])
      return pellegrino.useQuery(method, ...args)
    },
  }

  global.pellegrinos.push(pellegrino)

  return pellegrino
}
