import Button from "@italodeandra/pijama/components/Button";
import { notify } from "@italodeandra/pijama/components/Snackbar/snackbarState";
import TextField from "@italodeandra/pijama/components/TextField";
import { useSnapshot } from "valtio";
import { useInsertTask } from "../../../../pages/api/task/insertTask";
import { useUpdateTask } from "../../../../pages/api/task/updateTask";
import state from "../../../state";

const TaskForm = () => {
  const { selectedTask, setTaskDescription, taskDescription } =
    useSnapshot(state);

  const { mutate: insertTask, isLoading: isCreating } = useInsertTask({
    onSuccess() {
      setTaskDescription("");
    },
  });
  const { mutate: updateTask, isLoading: isUpdating } = useUpdateTask();

  const handleAddClick = () => {
    if (!taskDescription) {
      return notify("Please fill the description");
    }
    insertTask({ description: taskDescription });
  };

  const handleUpdateClick = () => {
    if (!taskDescription) {
      return notify("Please fill the description");
    }
    return updateTask({ _id: selectedTask!, description: taskDescription });
  };

  return (
    <>
      <TextField
        label={selectedTask ? "Task" : "New task"}
        onChange={({ target: { value } }) => setTaskDescription(value)}
        type="text"
        value={taskDescription}
      />
      {!selectedTask ? (
        <Button onClick={handleAddClick} loading={isCreating}>
          {!isCreating ? "Add task" : "Adding task"}
        </Button>
      ) : (
        <Button onClick={handleUpdateClick} loading={isUpdating}>
          {!isUpdating ? "Save task" : "Saving task"}
        </Button>
      )}
    </>
  );
};

export default TaskForm;
