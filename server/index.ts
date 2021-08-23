import { createServer } from "http";
import next from "next";
import { setupSocketServer } from "../lib/socket";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle);

  setupSocketServer(server);

  server.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`);
  });
});
