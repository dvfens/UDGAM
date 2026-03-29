import type { Server as SocketIOServer } from "socket.io";

import type { GalleryItem, LiveMatch } from "@/lib/types";

declare global {
  var __udgamSocketServer: SocketIOServer | undefined;
}

export function setSocketServer(server: SocketIOServer) {
  globalThis.__udgamSocketServer = server;
}

export function getSocketServer() {
  return globalThis.__udgamSocketServer;
}

export function emitScoreUpdate(matches: LiveMatch[]) {
  getSocketServer()?.emit("scores:update", matches);
}

export function emitGalleryUpdate(images: GalleryItem[]) {
  getSocketServer()?.emit("gallery:update", images);
}

