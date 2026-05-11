from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.realtime.connection_manager import manager

router = APIRouter(prefix="/realtime", tags=["realtime"])


@router.websocket("/presence/{user_id}")
async def presence_socket(websocket: WebSocket, user_id: UUID) -> None:
    await manager.connect(user_id, websocket)
    await manager.broadcast_json({"type": "presence.online", "userId": str(user_id)})
    try:
        while True:
            message = await websocket.receive_json()
            await manager.broadcast_json({"type": "presence.activity", "userId": str(user_id), "data": message})
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
        await manager.broadcast_json({"type": "presence.offline", "userId": str(user_id)})

