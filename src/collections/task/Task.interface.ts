import { ObjectId } from "mongodb";

export default interface ITask {
  _id: ObjectId;
  description: string;
  done?: boolean;
}
