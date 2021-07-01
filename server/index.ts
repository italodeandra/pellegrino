import { createServer } from "http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const port = process.env.PORT || 3000
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

  server.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`)
  })
})
