import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UpdateHistoryDto } from './dto/history.dto';
import { type RequestWithUser } from '../types/auth.type';
import { AtGuard } from '../common/guards/auth.guard';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('update')
  @UseGuards(AtGuard)
  async update(@Req() req: RequestWithUser, @Body() data: UpdateHistoryDto) {
    await this.historyService.updateHistory(req.user.id, data);
    return {
      message: 'oke',
    };
  }

  @Get()
  @UseGuards(AtGuard)
  async getHistory(@Req() req: RequestWithUser) {
    return this.historyService.getUserHistory(req.user.id);
  }
}
