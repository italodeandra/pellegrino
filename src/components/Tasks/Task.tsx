import { VFC } from "react";
import { ITask, default as TaskModel } from "../../models/Task";
import { useSnapshot } from "valtio";
import useMutation from "../../../lib/useMutation";
import state from "../../state";
import {
  CircularProgress,
  ListItemText,
  Checkbox,
  ListItemIcon,
  ListItem,
} from "@material-ui/core";

const Task: VFC<{
  task: ITask;
}> = ({ task }) => {
  const { selectedTask, setTaskDescription, setSelectedTask } =
    useSnapshot(state);

  let { mutate: markTaskAsDone, isLoading: isMarkingAsDone } = useMutation(() =>
    TaskModel.updateOne(
      { _id: task._id },
      {
        done: !task.done,
      }
    )
  );

  return (
    <ListItem
      button
      dense
      onClick={() => {
        if (selectedTask === task._id) {
          setSelectedTask(null);
          setTaskDescription("");
        } else {
          setSelectedTask(task._id);
          setTaskDescription(task.description);
        }
      }}
      role={undefined}
      selected={task._id === selectedTask}
    >
      <ListItemIcon>
        <Checkbox
          icon={isMarkingAsDone ? <CircularProgress size={24} /> : undefined}
          checked={task.done}
          disableRipple
          edge="start"
          inputProps={{ "aria-labelledby": task._id }}
          onClick={(e) => {
            e.stopPropagation();
            markTaskAsDone();
          }}
          tabIndex={-1}
        />
      </ListItemIcon>
      <ListItemText id={task._id} primary={task.description} />
    </ListItem>
  );
};

export default Task;
