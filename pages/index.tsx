import Button from "@italodeandra/pijama/components/Button";
import TextField from "@italodeandra/pijama/components/TextField";
import Stack from "@material-ui/core/Stack";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { useSnapshot } from "valtio";
import serialize from "../lib/serialize";
import Tasks from "../src/components/Tasks/Tasks";
import Task from "../src/models/Task";
import state from "../src/state";
import { useCreateTask } from "./api/task/createTask";
import { prefetchFindTasks } from "./api/task/findTasks";
import { useUpdateTask } from "./api/task/updateTask";

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await prefetchFindTasks(queryClient);

  return {
    props: {
      dehydratedState: serialize(dehydrate(queryClient)),
    },
  };
};

const Home = () => {
  const {
    search,
    setSearch,
    selectedTask,
    setTaskDescription,
    taskDescription,
  } = useSnapshot(state);

  const { mutate: createTask, isLoading: isCreating } = useCreateTask({
    onSuccess() {
      setTaskDescription("");
    },
  });
  const { mutate: updateTask, isLoading: isUpdating } = useUpdateTask();

  const handleAddClick = () => createTask({ description: taskDescription });

  const handleUpdateClick = () =>
    updateTask({ _id: selectedTask!, description: taskDescription });

  return (
    <Stack
      spacing={1}
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 2,
        height: "100vh",
        justifyContent: "center",
      }}
    >
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
