import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async *streamChatCompletion(userMessage: string): AsyncGenerator<string, void, unknown> {
    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: userMessage }],
        model: 'openai/gpt-oss-120b',
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: true,
        reasoning_effort: 'medium',
        stop: null,
      });

      // Iterate streaming chunks from the SDK and yield textual deltas
      for await (const chunk of chatCompletion as any) {
        const part = chunk?.choices?.[0]?.delta?.content ?? '';
        if (part) yield String(part);
      }
    } catch (err) {
      this.logger.error('Groq stream error', (err as any)?.stack ?? err);
      throw err;
    }
  }
}