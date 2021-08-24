import { Collection } from "mongodb";

export function createRepository<TSchema, TMethods extends {} = {}>(
  collectionName: string,
  methods: TMethods
): TMethods & { db: Collection<TSchema> } {
  return null as any;
}
