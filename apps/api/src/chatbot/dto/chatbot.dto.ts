import { ChatBotSchema } from '@workspace/shared/schema/chatbot/chatbot.dto';
import { createZodDto } from 'nestjs-zod';

export class ChatBotDto extends createZodDto(ChatBotSchema) {}
