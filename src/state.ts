import { proxy } from "valtio";
import { ITask } from "./models/Task";

const state = proxy({
  search: "",
  selectedTask: null as ITask["_id"] | null,
  taskDescription: "",
  setSearch(search: string) {
    state.search = search;
  },
  setSelectedTask(task: ITask["_id"] | null) {
    state.selectedTask = task;
  },
  setTaskDescription(description: string) {
    state.taskDescription = description;
  },
});

export default state;
