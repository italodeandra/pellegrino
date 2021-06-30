import { connect, ConnectOptions, Mongoose } from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

declare global {
  namespace NodeJS {
    // noinspection JSUnusedGlobalSymbols
    interface Global {
      mongoose: {
        conn: Mongoose | null
        promise: Promise<Mongoose> | null
      }
    }
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export const connectDb = async (
  uri = process.env.DATABASE_URL,
  options?: ConnectOptions
) => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const optionsWithDefaults: ConnectOptions = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    }

    console.info("uri", uri, "NODE_ENV", process.env.NODE_ENV)
    if (!uri && process.env.NODE_ENV !== "production") {
      const mongod = new MongoMemoryServer()
      uri = await mongod.getUri()
      console.info("Started a Mongo Memory Server at", uri)
    }
    if (!uri) {
      throw Error(
        `To connect to database the "connectDb" needs the uri to be passed on the first property or to be present on the environment variable "DATABASE_URL".`
      )
    }

    cached.promise = connect(uri, optionsWithDefaults).then((mongoose) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise

  return cached.conn
}
