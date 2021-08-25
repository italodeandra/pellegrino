import numericArray from "@italodeandra/pijama/utils/numericArray";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useSnapshot } from "valtio";
import { useFindTasks } from "../../../../pages/api/task/findTasks";
import state from "../../../state";
import Task, { SkeletonTask } from "../Task/Task";

const Tasks = () => {
  const { search } = useSnapshot(state);

  const { data: tasks, isLoading } = useFindTasks(search);

  return (
    <List>
      {isLoading &&
        !tasks?.length &&
        numericArray(3).map((i) => <SkeletonTask key={i} />)}
      {!isLoading && !tasks?.length && (
        <ListItem dense>
          <ListItemText
            secondary={
              !search ? "No tasks yet" : `No tasks like "${search}" found`
            }
          />
        </ListItem>
      )}
      {tasks?.map((task) => (
        <Task key={task._id.toString()} task={task} />
      ))}
    </List>
  );
};

export default Tasks;
