import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Skeleton from "@material-ui/core/Skeleton";
import { default as TaskModel } from "../../models/Task";
import { useSnapshot } from "valtio";
import state from "../../state";
import Task from "./Task";
import useSubscription from "../../../lib/useSubscription";

const Tasks = () => {
  const { search } = useSnapshot(state);

  const { data: tasks, isLoading } = useSubscription(() =>
    TaskModel.find(
      {
        description: { $options: "i", $regex: search },
      },
      "description done"
    )
  );

  return (
    <List>
      {isLoading && (
        <ListItem dense>
          <ListItemIcon>
            <Skeleton width={18} />
          </ListItemIcon>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
      )}
      {!isLoading && !tasks?.length && (
        <ListItem dense>
          <ListItemText secondary={"No tasks"} />
        </ListItem>
      )}
      {tasks?.map((task) => (
        <Task key={task._id} task={task} />
      ))}
    </List>
  );
};

export default Tasks;
