import { createEntity } from "../../lib"
import type { Document } from "mongoose"

interface Task extends Document {
  description: string
  done?: boolean
}

export const task = createEntity<Task>("Task", {
  description: { required: true, type: String },
  done: { default: false, required: true, type: Boolean },
})
