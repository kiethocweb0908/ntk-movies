import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async findTopViews() {
    const movies = await this.prisma.movie.findMany({
      where: {
        published: true,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,

        thumbUrl: true,
        posterUrl: true,

        content: true,
        type: true,
        year: true,
        time: true,
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
