import { createServer } from "node:http";
import { parse } from "node:url";

import next from "next";
import { Server as SocketIOServer } from "socket.io";

import { setSocketServer } from "./lib/socket-server";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST ?? "0.0.0.0";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

async function bootstrap() {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  const httpServer = createServer((request, response) => {
    const parsedUrl = parse(request.url ?? "/", true);
    void handle(request, response, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket/io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.emit("system:ready", {
      connectedAt: new Date().toISOString(),
    });
  });

  setSocketServer(io);

  httpServer.listen(port, hostname, () => {
    console.log(`UDGAM server ready on http://${hostname}:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap UDGAM server", error);
  process.exit(1);
});
