import { Collection } from "mongodb";

export function createRepository<TSchema, TMethods = unknown>(
  collectionName: string,
  methods: TMethods
): TMethods {
  return null as any;
}
