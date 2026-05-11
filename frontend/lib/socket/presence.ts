"use client";

import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:8000";

export function createPresenceSocket(token: string): Socket {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token }
  });
}

