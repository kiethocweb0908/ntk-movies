import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoyryQueryDto, UpdateHistoryDto } from './dto/history.dto';
import { type RequestWithUser } from '../types/auth.type';
import { AtGuard } from '../common/guards/auth.guard';
import { AppResponse } from '@workspace/shared/schema/movie/movie.response';
import { HistoriesResponse } from '@workspace/shared/schema/history/history.response';

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
  async getHistory(
    @Req() req: RequestWithUser,
    @Query() query: HistoyryQueryDto,
  ): Promise<AppResponse<HistoriesResponse>> {
    const data = await this.historyService.getUserHistory(req.user.id, query);
    return {
      message: 'Thành công!',
      data,
    };
  }
}
