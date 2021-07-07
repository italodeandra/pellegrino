import { Model } from "mongoose";
import { NextApiHandler } from "next";
import connectDb from "./connectDb";

const Pellegrino =
  (models: { [key: string]: Model<any> }): NextApiHandler =>
  async (req, res) => {
    await connectDb();
    const modelName = req.query.model as keyof typeof models;
    const method = req.query.method as string;
    const model: any = models[modelName];
    const args = req.body;
    const data = await model[method](...args);
    res.send(data);
  };

// noinspection JSUnusedGlobalSymbols
export default Pellegrino;
