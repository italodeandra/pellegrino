import { createRepository } from "@italodeandra/pijama/next/createRepository";
import { Filter, ObjectId } from "mongodb";
import ITask from "./Task.interface";

const TaskRepository = createRepository<ITask>("task", async () => {
  await db.createIndex({ description: "text" });
});

const db = TaskRepository;

export async function setupTaskCollection() {}

export async function findTasks(searchTerm?: string): Promise<ITask[]> {
  const filter1: Filter<ITask> = searchTerm
    ? {
        $text: {
          $search: searchTerm,
        },
      }
    : {};
  const filter2: Filter<ITask> = searchTerm
    ? {
        description: { $options: "i", $regex: searchTerm },
      }
    : {};
  let cursor = await db.find(filter1, {
    sort: { score: { $meta: "textScore" } },
    projection: {
      score: { $meta: "textScore" },
    },
  });
  if (await cursor.count()) {
  } else {
    cursor = await db.find(filter2);
  }
  return await cursor.toArray();
}

export async function insertTask(
  doc: Pick<ITask, "description">
): Promise<ITask["_id"]> {
  const result = await db.insertOne(doc);
  return result.insertedId;
}

export async function updateTask({
  _id,
  ...doc
}: Partial<ITask>): Promise<number> {
  const result = await db.updateOne({ _id: new ObjectId(_id) }, { $set: doc });
  return result.matchedCount;
}

export async function deleteTask(docId: ITask["_id"]): Promise<void> {
  await db.deleteOne({ _id: new ObjectId(docId) });
}

export default TaskRepository;
