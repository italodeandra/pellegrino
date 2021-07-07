import Stack from "@material-ui/core/Stack";
import TextField from "@italodeandra/pijama/components/TextField";
import Button from "@italodeandra/pijama/components/Button";
import Task from "../src/models/Task";
import useMutation from "../lib/useMutation";
import { useSnapshot } from "valtio";
import Tasks from "../src/components/Tasks/Tasks";
import state from "../src/state";

const Home = () => {
  const {
    search,
    setSearch,
    selectedTask,
    setTaskDescription,
    taskDescription,
  } = useSnapshot(state);

  const { mutate: createTask, isLoading: isCreating } = useMutation(() =>
    Task.create({ description: taskDescription })
  );

  const { mutate: updateSelectedTask, isLoading: isUpdating } = useMutation(
    () =>
      Task.updateOne(
        { _id: selectedTask },
        {
          description: taskDescription,
        }
      )
  );

  const handleAddClick = () => {
    createTask();
    setTaskDescription("");
  };

  const handleUpdateClick = () => {
    updateSelectedTask();
  };

  return (
    <Stack spacing={1} sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
      <TextField
        label={"Search"}
        onChange={({ target: { value } }) => setSearch(value)}
        size={"small"}
        type="text"
        value={search}
      />
      <Tasks />
      <TextField
        label={"Task"}
        onChange={({ target: { value } }) => setTaskDescription(value)}
        type="text"
        value={taskDescription}
      />
      {!selectedTask ? (
        <Button onClick={handleAddClick}>
          {!isCreating ? "Add task" : "Adding task"}
        </Button>
      ) : (
        <Button onClick={handleUpdateClick}>
          {!isUpdating ? "Save task" : "Saving task"}
        </Button>
      )}
    </Stack>
  );
};

// noinspection JSUnusedGlobalSymbols
export default Home;
