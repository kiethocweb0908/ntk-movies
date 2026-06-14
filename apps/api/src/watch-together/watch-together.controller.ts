import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WatchTogetherService } from './watch-together.service';
import { AtGuard } from '../common/guards/auth.guard';
import { type RequestWithUser } from '../types/auth.type';
import {
  createRoomyDto,
  GetRoomsSDto,
  joinRoomyDto,
} from './dto/watch-together.dto';
import { AppResponse } from '@workspace/shared/schema/movie/movie.response';
import {
  GetRoomsResponse,
  RoomResponse,
} from '@workspace/shared/schema/room/room.response';

@Controller('watch-together')
export class WatchTogetherController {
  constructor(private readonly watchTogetherService: WatchTogetherService) {}

  @Get('room-list')
  @UseGuards(AtGuard)
  async roomList(
    @Query() query: GetRoomsSDto,
  ): Promise<AppResponse<GetRoomsResponse>> {
    const data = await this.watchTogetherService.getRooms(query);

    return {
      message: 'Lấy danh sách phòng thành công!',
      data,
    };
  }

  @Post('create-room')
  @UseGuards(AtGuard)
  async createRoom(
    @Req() req: RequestWithUser,
    @Body() body: createRoomyDto,
  ): Promise<AppResponse<any>> {
    const room = await this.watchTogetherService.createRoom(req.user.id, body);
    return {
      message: 'Tạo phòng thành công!',
      data: room,
    };
  }

  @Get('check-room/:roomCode')
  @UseGuards(AtGuard)
  async checkRoom(
    @Req() req: RequestWithUser,
    @Param('roomCode') roomCode: string,
  ): Promise<AppResponse<any>> {
    const data = await this.watchTogetherService.checkRoom(req.user.id, roomCode);
    return {
      message: 'Kiểm tra phòng thành công!',
      data,
    };
  }

  @Post('join-room')
  @UseGuards(AtGuard)
  async joinRoom(
    @Req() req: RequestWithUser,
    @Body() body: joinRoomyDto,
  ): Promise<AppResponse<any>> {
    const room = await this.watchTogetherService.joinRoom(req.user.id, body);

    return {
      message: 'Tham gia phòng thành công!',
      data: room,
    };
  }

  @Delete('leave-room/:roomId')
  @UseGuards(AtGuard)
  async leaveRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: string,
  ): Promise<AppResponse<{ roomId: string }>> {
    await this.watchTogetherService.leaveRoom(req.user.id, roomId);

    return {
      message: 'Rời phòng thành công!',
      data: { roomId },
    };
  }

  @Delete('disband-room/:roomId')
  @UseGuards(AtGuard)
  async disbandRoom(
    @Req() req: RequestWithUser,
    @Param('roomId') roomId: string,
  ): Promise<AppResponse<{ roomId: string }>> {
    await this.watchTogetherService.disbandRoom(req.user.id, roomId);
    return {
      message: 'Giải tán phòng thành công!',
      data: { roomId },
    };
  }

  @Post('change-episode')
  @UseGuards(AtGuard)
  async changeEpisode(
    @Req() req: RequestWithUser,
    @Body() body: { roomCode: string; episodeId: string },
  ): Promise<AppResponse<any>> {
    const data = await this.watchTogetherService.changeEpisode(
      req.user.id,
      body.roomCode,
      body.episodeId,
    );
    return {
      message: 'Chuyển tập phim thành công!',
      data,
    };
  }
}
