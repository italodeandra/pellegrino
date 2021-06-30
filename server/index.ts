import { createServer } from "http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

declare global {
  namespace NodeJS {
    // noinspection JSUnusedGlobalSymbols
    interface Global {
      io: Server
    }
  }
}

app.prepare().then(() => {
  const server = createServer(handle)

  global.io = new Server(server)

  server.listen(3000, () => {
    console.info("> Ready on http://localhost:3000")
  })
})
