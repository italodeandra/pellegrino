import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@italodeandra/pijama"
import { Checkbox, ListItemIcon, Skeleton, Stack } from "@material-ui/core"
import { task } from "../entities/task"
import { useState } from "react"

const { useSubscription, useMutation } = task

const Home = () => {
  const [search, setSearch] = useState("")

  const { data: tasks, isLoading } = useSubscription(
    "find",
    {
      description: { $options: "i", $regex: search },
    },
    "description done"
  )
  const { mutate: createTask, isLoading: isCreating } = useMutation("create")
  const { mutate: updateTask, isLoading: isUpdating } = useMutation("updateOne")

  const [taskDescription, setTaskDescription] = useState("")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  return (
    <Stack spacing={1} sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
      <TextField
        label={"Search"}
        onChange={({ target: { value } }) => setSearch(value)}
        size={"small"}
        type="text"
        value={search}
      />
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
          <ListItem
            button
            dense
            key={task._id}
            onClick={() => {
              if (selectedTask === task._id) {
                setSelectedTask(null)
                setTaskDescription("")
              } else {
                setSelectedTask(task._id)
                setTaskDescription(task.description)
              }
            }}
            role={undefined}
            selected={task._id === selectedTask}
          >
            <ListItemIcon>
              <Checkbox
                checked={task.done}
                disableRipple
                edge="start"
                inputProps={{ "aria-labelledby": task._id }}
                onClick={(e) => {
                  e.stopPropagation()
                  updateTask(
                    { _id: task._id },
                    {
                      done: !task.done,
                    }
                  )
                }}
                tabIndex={-1}
              />
            </ListItemIcon>
            <ListItemText id={task._id} primary={task.description} />
          </ListItem>
        ))}
      </List>
      <TextField
        label={"Task"}
        onChange={({ target: { value } }) => setTaskDescription(value)}
        type="text"
        value={taskDescription}
      />
      {!selectedTask ? (
        <Button
          onClick={async () => {
            if (!isCreating) {
              await createTask({ description: taskDescription })
            }
          }}
        >
          {!isCreating ? "Add task" : "Adding task"}
        </Button>
      ) : (
        <Button
          onClick={async () => {
            if (!isCreating) {
              await updateTask(
                { _id: selectedTask },
                {
                  description: taskDescription,
                }
              )
            }
          }}
        >
          {!isUpdating ? "Save task" : "Saving task"}
        </Button>
      )}
    </Stack>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Home
