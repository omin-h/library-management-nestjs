import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { GroqService } from './groq.service'

@WebSocketGateway({ cors: { origin: '*' } })
export class LlmGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(LlmGateway.name)

  @WebSocketServer()
  server: Server

  constructor(private readonly groqService: GroqService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`)
  }

  // payload: { id: string, text: string, ...meta }
  @SubscribeMessage('ask_llm')
  async handleAskLlm(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const messageId = payload?.id
    const text = String(payload?.text ?? '')

    if (!messageId || !text) {
      client.emit('llm_error', { id: messageId ?? null, reason: 'invalid payload' })
      return { status: 'error' }
    }

    client.emit('llm_start', { id: messageId })

    try {
      // streamChatCompletion is an async generator -> iterate with for-await-of
      for await (const chunk of this.groqService.streamChatCompletion(text)) {
        // send each chunk only to the requesting client
        client.emit('llm_chunk', { id: messageId, chunk })
        if (!client.connected) break
      }
      client.emit('llm_end', { id: messageId, ok: true })
    } catch (err) {
      this.logger.error('LLM stream error', (err as any)?.stack ?? err)
      client.emit('llm_error', { id: messageId, reason: String(err) })
    }

    return { status: 'accepted' }
  }
}