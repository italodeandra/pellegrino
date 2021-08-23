import trashIcon from "@iconify/icons-heroicons-outline/trash";
import Icon from "@italodeandra/pijama/components/Icon";
import IconButton from "@italodeandra/pijama/components/IconButton";
import {
  Checkbox,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import Skeleton from "@material-ui/core/Skeleton";
import { MouseEventHandler, VFC } from "react";
import { useSnapshot } from "valtio";
import { useDeleteTask } from "../../../pages/api/task/deleteTask";
import { useMarkTaskAsDone } from "../../../pages/api/task/markTaskAsDone";
import { ITask } from "../../models/Task";
import state from "../../state";

const Task: VFC<{
  task: ITask;
}> = ({ task }) => {
  const { selectedTask, setTaskDescription, setSelectedTask } =
    useSnapshot(state);

  const { mutate: markTaskAsDone, isLoading: isMarkingAsDone } =
    useMarkTaskAsDone();
  const { mutate: deleteTask, isLoading: isDeleting } = useDeleteTask({
    onSuccess() {
      if (task._id === selectedTask) {
        setSelectedTask(null);
        setTaskDescription("");
      }
    },
  });

  const handleTaskClick = () => {
    if (selectedTask === task._id) {
      setSelectedTask(null);
      setTaskDescription("");
    } else {
      setSelectedTask(task._id);
      setTaskDescription(task.description);
    }
  };

  const handleCheck: MouseEventHandler = (e) => {
    e.stopPropagation();
    markTaskAsDone({ _id: task._id, done: !task.done });
  };

  const handleDeleteClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    deleteTask({
      _id: task._id,
    });
  };

  return (
    <ListItem
      button
      dense
      onClick={handleTaskClick}
      selected={task._id === selectedTask}
      secondaryAction={
        <IconButton edge="end" onClick={handleDeleteClick}>
          {isDeleting ? (
            <CircularProgress size={24} />
          ) : (
            <Icon icon={trashIcon} />
          )}
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          icon={isMarkingAsDone ? <CircularProgress size={24} /> : undefined}
          checked={task.done}
          disableRipple
          edge="start"
          inputProps={{ "aria-labelledby": task._id }}
          onClick={handleCheck}
          tabIndex={-1}
        />
      </ListItemIcon>
      <ListItemText id={task._id} primary={task.description} />
    </ListItem>
  );
};

export const SkeletonTask = () => (
  <ListItem
    dense
    secondaryAction={
      <IconButton edge="end">
        <Skeleton width={24} />
      </IconButton>
    }
  >
    <ListItemIcon>
      <Skeleton width={18} />
    </ListItemIcon>
    <ListItemText primary={<Skeleton />} />
  </ListItem>
);

export default Task;
