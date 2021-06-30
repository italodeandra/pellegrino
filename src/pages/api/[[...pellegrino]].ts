import { createApiHandler } from "../../../lib/server"
import { task } from "../../entities/task"

const apiHandler = createApiHandler([task])

// noinspection JSUnusedGlobalSymbols
export default apiHandler
