import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHistoryType } from '@workspace/shared/schema/history/history.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  // Cập nhật tập phim
  async updateHistory(userId: string, data: UpdateHistoryType) {
    const { episodeId, currentTime, duration } = data;

    const isCompleted = duration > 0 ? currentTime / duration > 0.95 : false;

    const history = await this.prisma.history.upsert({
      where: {
        userId_episodeId: { userId, episodeId },
      },
      update: {
        currentTime,
        duration,
        isCompleted: isCompleted || undefined,
        updatedAt: new Date(),
      },
      create: {
        userId,
        episodeId,
        currentTime,
        duration,
        isCompleted,
      },
    });

    return history;
  }

  // Lấy danh sách phim đã xem
  async getUserHistory(userId: string) {
    const histories = await this.prisma.history.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        currentTime: true,
        duration: true,
        updatedAt: true,
        isCompleted: true,
        episode: {
          select: {
            slug: true,
            name: true,
            serverId: true,
            server: {
              select: {
                movie: {
                  select: {
                    id: true,
                    name: true,
                    originName: true,
                    thumbUrl: true,
                    posterUrl: true,
                    status: true,
                    lang_key: true,
                    lang: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatedHistories = histories.map((item) => {
      const movie = item.episode.server.movie;
      const progress =
        item.duration > 0
          ? Math.round((item.currentTime / item.duration) * 100)
          : 0;

      return {
        ...item,
        progress,
        episode: {
          name: item.episode.name,
          slug: item.episode.slug,
          serverId: item.episode.serverId,
        },
        movie: {
          ...movie,
        },
      };
    });

    return formatedHistories;
  }
}
