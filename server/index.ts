import { setupSocketServer } from "@italodeandra/pijama/api/socket";
import { createServer } from "http";
import next from "next";
import { setupTaskCollection } from "../src/collections/task/Task.repository";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer(handle);

  setupSocketServer(server);
  await setupTaskCollection();

  server.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`);
  });
});
