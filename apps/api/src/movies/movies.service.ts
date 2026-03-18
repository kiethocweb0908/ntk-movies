import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Prisma } from '@prisma/client';
import { MovieResponse } from '@workspace/shared/schema/movie/movie.response';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomeByQuery(
    query: Partial<MovieQueryDto>,
  ): Promise<MovieResponse[]> {
    const {
      page = 1,
      limit = 10,
      category,
      country,
      mood,
      featured,
      chieurap,
      search,
      year,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.MovieWhereInput = {
      published: true,
      // Thể loại
      categories: category
        ? { some: { category: { slug: category } } }
        : undefined,
      // Quốc gia
      countries: country ? { some: { country: { slug: country } } } : undefined,
      // Năm
      year: year ? year : undefined,
      // Chiếu rạp
      chieurap: chieurap ? chieurap : undefined,
      // tìm
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            { originName: { contains: search, mode: 'insensitive' } },
            { alternativeNames: { has: search } },
          ]
        : undefined,
    };

    // if (mood === 'trending') {
    //   where.viewCount = { gte: 1000 }; // Ví dụ: Mood trending là trên 1k views
    // } else if (mood === 'high-rated') {
    //   where.rating = { gte: 8 };
    // }

    let orderBy: Prisma.MovieOrderByWithRelationInput = { createdAt: 'desc' };
    if (featured) {
      orderBy = { viewCount: 'desc' };
    }

    const movies = await this.prisma.movie.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy,
      select: {
        id: true,
        name: true,
        originName: true,
        slug: true,

        thumbUrl: true,
        posterUrl: true,

        content: true,
        type: true,
        year: true,
        time: true,
        lang: true,
        lang_key: true,
        quality: true,
        status: true,

        tmdbType: true,
        tmdbSeason: true,
        tmdb_vote_average: true,
        tmdb_vote_count: true,
        imdb_vote_average: true,
        imdb_vote_count: true,

        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        countries: {
          select: {
            country: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return movies.map((movie) => ({
      ...movie,
      categories: movie.categories.map((c) => c.category),
      countries: movie.countries.map((c) => c.country),
    }));
  }
}
