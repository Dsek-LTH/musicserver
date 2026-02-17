import { createServer } from "http";
import next from "next";
import express from "express";
import { WebSocketServer } from "ws";

// Reference:
// https://github.com/dfjs/realtime-physical-spaces/blob/main/server.js

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextServer = next({ dev });
const nextHandler = nextServer.getRequestHandler();
nextServer.prepare().then(() => {
  const expressServer = express(); // Server for websocket
  const server = createServer(expressServer);
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    // https://github.com/vitejs/vite/discussions/14182
    if (req.headers["sec-websocket-protocol"] !== "next") {
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws, req) => {
    console.log("Websocket: Connected");
  });

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
