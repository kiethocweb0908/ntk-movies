import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  createRoomType,
  GetRoomsType,
  joinRoomType,
} from '@workspace/shared/schema/room/room.dto';
import * as argon2 from 'argon2';
import { WatchTogetherGateway } from './watch-together.gateway';
import { WatchParticipant, WatchRoom } from '@prisma/client';
import {
  EpisodeDetail,
  GetRoomsResponse,
  RoomResponse,
} from '@workspace/shared/schema/room/room.response';
import { MoviesService } from '../movies/movies.service';

type ParticipationWithRoom = WatchParticipant & {
  room: WatchRoom;
};

@Injectable()
export class WatchTogetherService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly watchTogetherGateway: WatchTogetherGateway,
    private readonly moviesService: MoviesService,
  ) {}

  private async generateUniqueRoomCode(): Promise<string> {
    let isUnique = false;
    let code = '';
    while (!isUnique) {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await this.prisma.watchRoom.findUnique({
        where: { roomCode: code },
      });
      if (!existing) isUnique = true;
    }
    return code;
  }

  private async handleUserLeavingRoom({
    userId,
    oldParticipation,
    roomId,
  }: {
    userId: string;
    roomId?: string;
    oldParticipation?: ParticipationWithRoom;
  }) {
    let participation: ParticipationWithRoom | null = oldParticipation || null;
    if (roomId) {
      participation = await this.prisma.watchParticipant.findUnique({
        where: { userId_roomId: { userId, roomId } },
        include: { room: true },
      });
    }
    if (!participation) return null;

    const roomCode = participation.room.roomCode;

    // FIX: Truy xuất tên người dùng để Frontend in ra đúng thay vì chữ "Một thành viên"
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.email;

    if (participation.room.hostId === userId) {
      await this.prisma.watchParticipant.deleteMany({
        where: { roomId: participation.roomId },
      });
      await this.prisma.watchRoom.delete({
        where: { id: participation.roomId },
      });
      this.emitDisbanded(roomCode);
    } else {
      await this.prisma.watchParticipant.delete({
        where: { userId_roomId: { userId, roomId: participation.roomId } },
      });
      // Cập nhật emit thêm userName
      this.watchTogetherGateway.server.to(roomCode).emit('on-user-left', {
        userId,
        userName,
        message: `Người dùng đã rời phòng.`,
      });
    }
    return roomCode;
  }

  private emitDisbanded(roomCode: string) {
    this.watchTogetherGateway.server.to(roomCode).emit('on-room-disbanded', {
      message: 'Chủ phòng đã giải tán phòng này.',
    });
  }
  //-----------------------------------------------------------------

  // Tạo phòng
  async createRoom(userId: string, data: createRoomType) {
    const { name, movieId, episodeId, isPrivate, password } = data;

    const existingMovie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      select: {
        id: true,
        slug: true,
        name: true,
        status: true,
        servers: {
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: {
            episodes: {
              orderBy: { slug: 'asc' },
              take: 1,
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!existingMovie) throw new NotFoundException('Phim không tồn tại!');

    let epId: string;

    if (episodeId) {
      const episode = await this.prisma.episode.findFirst({
        where: { id: episodeId, server: { movieId: movieId } },
        select: { id: true },
      });
      if (!episode)
        throw new NotFoundException('Tập phim không hợp lệ cho phim này!');

      epId = episodeId;
    } else {
      const firstEp = existingMovie?.servers[0]?.episodes[0];
      if (!firstEp || existingMovie.status === 'trailer')
        throw new NotFoundException('Phim bạn chọn hiện chỉ có trailer!');

      epId = firstEp.id;
    }

    const oldParticipation = await this.prisma.watchParticipant.findFirst({
      where: { userId, room: { isActive: true } },
      include: { room: true },
    });

    if (oldParticipation)
      await this.handleUserLeavingRoom({ userId, oldParticipation });

    const roomCode = await this.generateUniqueRoomCode();
    const hashPassword = password ? await argon2.hash(password) : null;

    await this.prisma.watchRoom.create({
      data: {
        hostId: userId,
        movieId,
        episodeId: epId || null,
        roomCode,
        name: name || existingMovie.name,
        isPrivate,
        password: hashPassword,
        participants: {
          create: {
            userId,
          },
        },
      },
    });

    return this.checkRoom(userId, roomCode);
  }

  // ✅ FIX: Thêm tham số skipPasswordCheck để bypass khi đã check pass ở joinRoom
  async checkRoom(
    userId: string,
    roomCode: string,
    skipPasswordCheck: boolean = false,
  ): Promise<any> {
    const targetRoom = await this.prisma.watchRoom.findUnique({
      where: { roomCode, isActive: true },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!targetRoom) {
      throw new NotFoundException('Phòng không tồn tại hoặc đã kết thúc!');
    }

    const isHost = targetRoom.hostId === userId;
    const isParticipant = targetRoom.participants.some(
      (p) => p.user.id === userId,
    );

    // Nếu không bypass, phòng private, ko phải host và chưa vào phòng thì yêu cầu MK
    if (
      !isHost &&
      targetRoom.isPrivate &&
      !isParticipant &&
      !skipPasswordCheck
    ) {
      return {
        isHost: false,
        requirePassword: true,
        room: {
          id: targetRoom.id,
          roomCode: targetRoom.roomCode,
          name: targetRoom.name,
          isPrivate: true,
        },
      };
    }

    if (!isParticipant) {
      const oldParticipation = await this.prisma.watchParticipant.findFirst({
        where: {
          userId,
          roomId: { not: targetRoom.id },
          room: { isActive: true },
        },
        include: { room: true },
      });

      if (oldParticipation) {
        await this.handleUserLeavingRoom({ userId, oldParticipation });
      }

      await this.prisma.watchParticipant.upsert({
        where: { userId_roomId: { roomId: targetRoom.id, userId } },
        update: { joinedAt: new Date() },
        create: { roomId: targetRoom.id, userId },
      });
    }

    const movieObj = await this.prisma.movie.findUnique({
      where: { id: targetRoom.movieId },
      select: { slug: true },
    });

    const movieDetail = movieObj
      ? await this.moviesService.getMovieDetail(movieObj.slug)
      : null;

    let episodeDetail: EpisodeDetail | null = null;
    if (targetRoom.episodeId) {
      episodeDetail = await this.prisma.episode.findUnique({
        where: { id: targetRoom.episodeId },
        select: {
          id: true,
          name: true,
          linkEmbed: true,
          linkM3u8: true,
          slug: true,
        },
      });
    }

    const freshParticipants = await this.prisma.watchParticipant
      .findMany({
        where: { roomId: targetRoom.id },
        select: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      })
      .then((list) => list.map((p) => p.user));

    return {
      isHost,
      requirePassword: false,
      room: {
        id: targetRoom.id,
        roomCode: targetRoom.roomCode,
        name: targetRoom.name,
        movieId: targetRoom.movieId,
        episodeId: targetRoom.episodeId,
        isPrivate: targetRoom.isPrivate,
        isPlaying: targetRoom.isPlaying,
        currentTime: targetRoom.currentTime,
        isActive: targetRoom.isActive,
        hostId: targetRoom.hostId,
        participants: freshParticipants,
        isHost,
        movie: movieDetail?.movie || null,
        servers: movieDetail?.servers || [],
        episode: episodeDetail,
      },
    };
  }

  // Vào phòng
  async joinRoom(userId: string, data: joinRoomType): Promise<any> {
    const { roomCode, password } = data;

    const targetRoom = await this.prisma.watchRoom.findUnique({
      where: { roomCode, isActive: true },
    });

    if (!targetRoom)
      throw new NotFoundException('Phòng không tồn tại hoặc đã kết thúc!');

    // kiểm tra mật khẩu
    if (
      targetRoom.isPrivate &&
      targetRoom.password &&
      targetRoom.hostId !== userId
    ) {
      if (!password) throw new BadRequestException('Mật khẩu không chính xác!');
      const isMatch = await argon2.verify(targetRoom.password, password);
      if (!isMatch) throw new BadRequestException('Mật khẩu không chính xác!');
    }

    // ✅ FIX: Gọi checkRoom nhưng truyền thêm skipPasswordCheck = true để ép trả về full thông tin
    return this.checkRoom(userId, roomCode, true);
  }

  // Giải tán phòng
  async disbandRoom(userId: string, roomId: string) {
    const existingRoom = await this.prisma.watchRoom.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) throw new NotFoundException('Không tìm thấy phòng!');
    if (existingRoom?.hostId !== userId)
      throw new ForbiddenException('Chỉ chủ phòng mới được giải tán!');

    const roomCode = existingRoom.roomCode;
    try {
      // Chạy Transaction để đảm bảo xóa sạch Participant và Room cùng lúc
      await this.prisma.$transaction([
        this.prisma.watchParticipant.deleteMany({ where: { roomId } }),
        this.prisma.watchRoom.delete({ where: { id: roomId } }),
      ]);
      this.emitDisbanded(roomCode);

      return;
    } catch (error) {
      throw new BadRequestException(
        'Không thể giải tán phòng lúc này, vui lòng thử lại!',
      );
    }
  }

  // Rời phòng
  async leaveRoom(userId: string, roomId: string) {
    const roomCode = await this.handleUserLeavingRoom({ userId, roomId });
    if (!roomCode) throw new NotFoundException('Bạn không ở trong phòng này!');
    return;
  }

  // Lấy danh sách phòng
  async getRooms(query: GetRoomsType): Promise<GetRoomsResponse> {
    const { cursor, limit = 10 } = query;

    const rooms = await this.prisma.watchRoom.findMany({
      where: {
        isActive: true,
        ...(cursor && {
          updatedAt: {
            lt: new Date(cursor),
          },
        }),
      },
      take: limit + 1,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        roomCode: true,
        isPrivate: true,
        updatedAt: true,
        movie: {
          select: {
            id: true,
            slug: true,
            name: true,
            originName: true,
            posterUrl: true,
            thumbUrl: true,
          },
        },
      },
    });

    const hasMore = rooms.length > limit;
    const items = hasMore ? rooms.slice(0, limit) : rooms;

    return {
      rooms: items,
      nextCursor:
        hasMore && items.length > 0
          ? items[items.length - 1].updatedAt.toISOString()
          : null,
      hasMore,
    };
  }

  // Chuyển tập phim
  async changeEpisode(userId: string, roomCode: string, episodeId: string) {
    const room = await this.prisma.watchRoom.findUnique({
      where: { roomCode, isActive: true },
    });

    if (!room) throw new NotFoundException('Phòng không tồn tại!');
    if (room.hostId !== userId)
      throw new ForbiddenException('Chỉ chủ phòng mới được chuyển tập!');

    const episode = await this.prisma.episode.findUnique({
      where: { id: episodeId, server: { movieId: room.movieId } },
      select: {
        id: true,
        name: true,
        linkEmbed: true,
        linkM3u8: true,
        slug: true,
      },
    });

    if (!episode) throw new NotFoundException('Tập phim không hợp lệ!');

    await this.prisma.watchRoom.update({
      where: { id: room.id },
      data: { episodeId },
    });

    // Phát tin nhắn socket báo đổi tập phim
    this.watchTogetherGateway.server.to(roomCode).emit('on-change-episode', {
      episodeId,
      episode,
    });

    return {
      roomCode,
      episodeId,
      episode,
    };
  }
}
