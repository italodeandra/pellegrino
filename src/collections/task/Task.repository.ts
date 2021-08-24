import { ObjectId } from "mongodb";
import { createRepository } from "../../../lib/createRepository";
import ITask from "./Task.interface";

const TaskRepository = createRepository<ITask>("task", {
  async find(): Promise<ITask[]> {
    const { db } = TaskRepository;
    const result = await db.find();
    return result.toArray();
  },
  async insert(doc: Pick<ITask, "description">): Promise<ObjectId> {
    const { db } = TaskRepository;
    const result = await db.insertOne(doc);
    return result.insertedId;
  },
  async updateDescriptionById(id: string, description: string): Promise<void> {
    const { db } = TaskRepository;
    await db.findOneAndUpdate({ _id: id }, { description });
  },
  async toggleDoneById(id: string): Promise<void> {
    const { db } = TaskRepository;
    const query = { _id: id };
    const doc = await db.findOne(query);
    if (!doc) {
      return;
    }
    await db.updateOne(query, { done: !doc.done });
  },
});

export default TaskRepository;
