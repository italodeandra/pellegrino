import { Document } from "mongodb";

export default interface ITask extends Document {
  description: string;
  done?: boolean;
}
