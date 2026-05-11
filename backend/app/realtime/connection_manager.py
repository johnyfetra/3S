from uuid import UUID
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active: dict[UUID, set[WebSocket]] = {}

    async def connect(self, user_id: UUID, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active.setdefault(user_id, set()).add(websocket)

    def disconnect(self, user_id: UUID, websocket: WebSocket) -> None:
        connections = self.active.get(user_id)
        if not connections:
            return
        connections.discard(websocket)
        if not connections:
            self.active.pop(user_id, None)

    async def broadcast_json(self, payload: dict[str, object]) -> None:
        for sockets in self.active.values():
            for websocket in sockets:
                await websocket.send_json(payload)


manager = ConnectionManager()

