import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  HistoyryQueryType,
  UpdateHistoryType,
} from '@workspace/shared/schema/history/history.dto';
import { HistoriesResponse } from '@workspace/shared/schema/history/history.response';

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
  async getUserHistory(
    userId: string,
    query: HistoyryQueryType,
  ): Promise<HistoriesResponse> {
    const { limit = 10, cursor } = query;
    const histories = await this.prisma.history.findMany({
      where: {
        userId,
        ...(cursor && {
          updatedAt: {
            lt: new Date(cursor),
          },
        }),
      },
      take: limit + 1,
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
                name: true,
                movie: {
                  select: {
                    id: true,
                    slug: true,
                    name: true,
                    originName: true,
                    thumbUrl: true,
                    posterUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const hasMore = histories.length > limit;
    const items = hasMore ? histories.slice(0, limit) : histories;

    const formattedItems = items.map((item) => {
      const movie = item.episode.server.movie;
      const progress =
        item.duration > 0
          ? Math.round((item.currentTime / item.duration) * 100)
          : 0;

      return {
        history: {
          currentTime: item.currentTime,
          duration: item.duration,
          isCompleted: item.isCompleted,
          updatedAt: item.updatedAt,
          progress,
        },
        episode: {
          serverName: item.episode.server.name,
          name: item.episode.name,
          slug: item.episode.slug,
          serverId: item.episode.serverId,
        },
        movie: {
          ...movie,
        },
      };
    });

    return {
      histories: formattedItems,
      nextCursor:
        hasMore && items.length > 0
          ? items[items.length - 1].updatedAt.toISOString()
          : null,
      hasMore,
    };
  }
}
