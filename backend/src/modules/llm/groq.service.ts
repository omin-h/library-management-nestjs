import * as dotenv from 'dotenv'
dotenv.config()

import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private groq: Groq;

  constructor() {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      this.logger.error(
        'GROQ_API_KEY is missing. Set GROQ_API_KEY in backend/.env or environment variables.'
      );
      throw new Error('Missing GROQ_API_KEY environment variable');
    }

    // instantiate with validated key
    this.groq = new Groq({
      apiKey: key,
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