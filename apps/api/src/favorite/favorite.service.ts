import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HistoyryQueryType } from '@workspace/shared/schema/history/history.dto';
import { MoviesService } from '../movies/movies.service';
import { FavoritesResponse } from '@workspace/shared/schema/favorite/favorite.response';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService,
  ) {}

  // Lấy danh sách ids phim yêu thích
  async getFavoriteMovieIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { movieId: true },
    });

    if (!favorites.length) return [];
    return favorites.map((f) => f.movieId);
  }

  // Lấy danh sách phim yêu thích
  async getUserFavorites(
    userId: string,
    query: HistoyryQueryType,
  ): Promise<FavoritesResponse> {
    const { cursor, limit = 10 } = query;

    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
        ...(cursor && {
          createdAt: {
            lt: new Date(cursor),
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1,
      select: {
        createdAt: true,
        movie: { select: this.moviesService.select },
      },
    });

    // let nextCursor: string | null = null;

    // if (favorites.length > limit) {
    //   const items = favorites.slice(0, limit);
    //   const nextItem = favorites[limit];
    //   nextCursor = nextItem ? nextItem.createdAt.toISOString() : null;
    // }

    const hasMore = favorites.length > limit;
    const items = hasMore ? favorites.slice(0, limit) : favorites;

    const movies = items.map((item) => item.movie);
    const formatedMovies = this.moviesService.formatMovie(movies);

    return {
      favorites: formatedMovies,
      nextCursor:
        hasMore && items.length > 0
          ? items[items.length - 1].createdAt.toISOString()
          : null,
      hasMore,
    };
  }

  // cập nhật yêu thích thêm/xoá
  async updateFavorite(userId: string, movieId: string) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });
    if (!existingMovie) throw new NotFoundException('Phim không tồn tại');

    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId: userId,
        movieId: movieId,
      },
    });

    if (favorite) {
      await this.prisma.favorite.delete({
        where: {
          userId_movieId: {
            userId: userId,
            movieId: movieId,
          },
        },
      });
      return {
        message: `Đã xóa "${existingMovie.name}" khỏi danh sách yêu thích`,
      };
    }

    await this.prisma.favorite.create({
      data: {
        userId: userId,
        movieId: movieId,
      },
    });

    return {
      message: `Đã thêm "${existingMovie.name}" vào danh sách yêu thích`,
    };
  }
}
