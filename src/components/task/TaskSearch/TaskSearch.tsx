import informationCircle from "@iconify/icons-heroicons-outline/information-circle";
import Icon from "@italodeandra/pijama/components/Icon";
import TextField from "@italodeandra/pijama/components/TextField";
import { InputAdornment, Tooltip } from "@material-ui/core";
import { useSnapshot } from "valtio";
import state from "../../../state";

const TaskSearch = () => {
  const { search, setSearch } = useSnapshot(state);

  return (
    <TextField
      label="Search"
      onChange={({ target: { value } }) => setSearch(value)}
      size={"small"}
      type="text"
      value={search}
      InputProps={{
        endAdornment: (
          <Tooltip
            title={`You can search by any word (eg: foo), exact words (eg: "foo") or regex (eg: foo$)`}
          >
            <InputAdornment position="end">
              <Icon icon={informationCircle} fontSize={"small"} />
            </InputAdornment>
          </Tooltip>
        ),
      }}
    />
  );
};

export default TaskSearch;
