import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatBotDto } from './dto/chatbot.dto';
import { NoCheckToken } from '../common/decorators/no-check-tonken.decorator';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @NoCheckToken()
  @Post()
  async chat(@Body() body: ChatBotDto) {
    return this.chatbotService.handleChat(body);
  }
}
