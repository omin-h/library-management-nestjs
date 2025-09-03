import { Module } from '@nestjs/common'
import { LlmGateway } from './llm.controller'
import { GroqService } from './groq.service'

@Module({
  providers: [GroqService, LlmGateway],
  exports: [GroqService],
})
export class LlmModule {}