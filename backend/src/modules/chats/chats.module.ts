import { Module } from '@nestjs/common'
import { ChatsGateway } from './chats.controller'

@Module({
  providers: [ChatsGateway],
  exports: [ChatsGateway],
})
export class ChatsModule {}