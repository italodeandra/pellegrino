import { Stack, Toolbar } from "@material-ui/core";
import TaskForm from "./TaskForm/TaskForm";
import Tasks from "./Tasks/Tasks";
import TaskSearch from "./TaskSearch/TaskSearch";

const TaskView = () => (
  <Stack
    spacing={1}
    sx={{
      maxWidth: 500,
      mx: "auto",
      p: 2,
    }}
  >
    <Toolbar />
    <TaskSearch />
    <Tasks />
    <TaskForm />
  </Stack>
);

export default TaskView;
