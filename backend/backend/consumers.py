import sys

from django.conf import settings

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from asgiref.sync import sync_to_async

from .exceptions import ClientError


class VideoConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print('hi')

    async def receive_json(self, content):
        command = content.get("command", None)
        print(command)
        try:
            if command == "save":
                await self.send_chat(
                    content["chat"], content["message"], 
                    content['user'], content['type']
                )
        except ClientError as e:
            await self.send_json({"error": e.code})

    async def disconnect(self, code):
        for chat_id in list(self.chats):
            try:
                await self.leave_chat(chat_id)
            except ClientError:
                pass
