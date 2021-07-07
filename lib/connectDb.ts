import { connect, ConnectOptions, Mongoose } from "mongoose";
import getConfig from "next/config";

let {
  serverRuntimeConfig: { databaseUrl, appEnv },
} = getConfig();

declare global {
  // noinspection ES6ConvertVarToLetConst
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
    uri: string | null;
  };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, uri: null };
}

export default async function connectDb(
  options?: ConnectOptions
): Promise<[Mongoose, string]> {
  if (cached.conn) {
    return [cached.conn, cached.uri!];
  }

  cached.uri = databaseUrl;

  if (!cached.promise) {
    const optionsWithDefaults: ConnectOptions = {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    };

    if (!cached.uri && appEnv !== "production") {
      const { MongoMemoryServer } = await import("mongodb-memory-server");

      const mongod = await MongoMemoryServer.create();
      cached.uri = mongod.getUri();
      console.info("Started a Mongo Memory Server at", cached.uri);
    }
    if (!cached.uri) {
      throw Error(
        `To connect to database the "connectDb" needs the uri to be passed on the first property or to be present on the environment variable "DATABASE_URL".`
      );
    }

    cached.promise = connect(cached.uri!, optionsWithDefaults).then(
      (mongoose) => {
        return mongoose;
      }
    );
  }

  cached.conn = await cached.promise;

  return [cached.conn, cached.uri!];
}
