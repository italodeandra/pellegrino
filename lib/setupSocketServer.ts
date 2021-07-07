import { Server as SocketServer } from "socket.io";
import { Server } from "http";

declare global {
  // noinspection ES6ConvertVarToLetConst
  var io: SocketServer;
}

// noinspection JSUnusedGlobalSymbols
export default function setupSocketServer(server: Server) {
  const io = new SocketServer(server);

  global.io = io;

  io.on("connection", (socket) => {
    socket.on("subscribe", (model) => {
      socket.join(`model/${model}`);
    });
  });
}
