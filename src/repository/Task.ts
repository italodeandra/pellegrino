export interface ITask extends Document {
  description: string;
  done?: boolean;
}

function createRepository<TSchema, TMethods extends {} = {}>(
  collectionName: string,
  methods: TMethods
): TMethods & { db: Collection<TSchema> } {
  return null as any;
}

export function findTasks() {}

const Task = createRepository<ITask>("task", {
  async find(): Promise<ITask[]> {
    const { db } = Task;
    const result = await db.find();
    return result.toArray();
  },
  async insert(doc: Pick<ITask, "description">): Promise<ObjectId> {
    const { db } = Task;
    const result = await db.insertOne(doc);
    return result.insertedId;
  },
  async updateDescriptionById(id: string, description: string): Promise<void> {
    const { db } = Task;
    await db.findOneAndUpdate({ _id: id }, { description });
  },
  async toggleDoneById(id: string): Promise<void> {
    const { db } = Task;
    const query = { _id: id };
    const doc = await db.findOne(query);
    if (!doc) {
      return;
    }
    await db.updateOne(query, { done: !doc.done });
  },
});

export default Task;
