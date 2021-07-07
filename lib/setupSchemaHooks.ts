import { MongooseDocumentMiddleware, Schema } from "mongoose";

export default function setupSchemaHooks(name: string, schema: Schema<any>) {
  schema.post(
    [
      "updateOne",
      "findOneAndUpdate",
      "save",
      "updateMany",
    ] as MongooseDocumentMiddleware[],
    function () {
      global.io.to(`model/${name}`).emit("refetch");
    }
  );
}
