import AppBar from "@italodeandra/pijama/components/AppBar";
import { GetLayout } from "@italodeandra/pijama/next/AppProps";
import { Toolbar, Typography } from "@material-ui/core";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import TaskView from "../src/components/task/TaskView";
import { prefetchFindTasks } from "./api/task/findTasks";

// noinspection JSUnusedGlobalSymbols
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await prefetchFindTasks(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Home = () => <TaskView />;

export const getLayout: GetLayout = (page) => (
  <>
    <AppBar>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontSize: (theme) => theme.typography.pxToRem(18),
            flexGrow: 1,
          }}
          align={"center"}
        >
          To do list
        </Typography>
      </Toolbar>
    </AppBar>
    {page}
  </>
);
Home.getLayout = getLayout;

// noinspection JSUnusedGlobalSymbols
export default Home;
