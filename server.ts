import { createServer } from "http";
import { parse } from "url";
import next from "next";
import express from "express";
import { Server } from "socket.io";

// Reference:
// https://github.com/dfjs/realtime-physical-spaces/blob/main/server.js

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextServer = next({ dev });
const nextHandler = nextServer.getRequestHandler();

nextServer.prepare().then(() => {
  const expressServer = express(); // Server for websocket
  const server = createServer(expressServer);
  const io = new Server(server);
  expressServer.all("{*splat}", (req, res) => {
    // Reroute to next server handler
    return nextHandler(req, res);
  });
  server.listen(port, () => {
    console.log(
      `Sever listening at http://localhost:${port} as ${dev ? `development` : process.env.NODE_ENV}`,
    );
  });
});
