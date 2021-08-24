import { isServer } from "@italodeandra/pijama/utils/isBrowser";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import socketIOClient from "socket.io-client";

declare global {
  // noinspection ES6ConvertVarToLetConst
  var io: SocketServer;
}

// noinspection JSUnusedGlobalSymbols
export function setupSocketServer(server: Server) {
  global.io = new SocketServer(server);
}

const socket = isServer ? global.io : socketIOClient();

export default socket;