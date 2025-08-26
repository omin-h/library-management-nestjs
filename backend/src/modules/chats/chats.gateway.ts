import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatsGateway.name)

  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // simple validation
    if (!data || typeof data !== 'object') return

    const msg = {
      ...data,
      receivedAt: new Date().toISOString(),
      fromSocket: client?.id ?? 'unknown',
    }

    // broadcast to all clients except sender
    client.broadcast.emit('message', msg)

    // optional ack response
    return { status: 'ok' }
  }
}