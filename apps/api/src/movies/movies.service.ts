import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Prisma } from '@prisma/client';
import { MovieResponse } from '@workspace/shared/schema/movie/movie.response';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  private select = {
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
  };

  private formatMovie(movies) {
    return movies.map((movie) => ({
      ...movie,
      categories: movie.categories.map((c) => c.category),
      countries: movie.countries.map((c) => c.country),
    }));
  }

  private getCategoryByMood(moodId: string): string[] {
    const moodMap = {
      combat: ['hanh-dong', 'hinh-su', 'chien-tranh', 'vo-thuat'],
      'cau-luong': ['tinh-cam', 'tam-ly', 'hoc-duong'],
      'thao-tung': ['tam-ly', 'bi-an', 'vien-tuong', 'hinh-su', 'hanh-dong'],
      'chua-lanh': ['hai-huoc', 'gia-dinh', 'phieu-luu'],
      'sinh-ton': ['hanh-dong', 'vien-tuong', 'phieu-luu', 'kinh-di'],
    };
    return moodMap[moodId] || [];
  }

  //---------------------------------------------

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
      select: this.select,
    });

    return this.formatMovie(movies);
  }

  async getMoviesByMood(moodId: string) {
    const categories = this.getCategoryByMood(moodId);

    const combinations: Prisma.MovieWhereInput[] = [];
    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        combinations.push({
          AND: [
            { categories: { some: { category: { slug: categories[i] } } } },
            { categories: { some: { category: { slug: categories[j] } } } },
          ],
        });
      }
    }

    let whereCondition: Prisma.MovieWhereInput = {
      OR: combinations,
      type: { not: 'hoathinh' },
    };

    switch (moodId) {
      case 'cau-luong':
        whereCondition.countries = {
          some: {
            country: {
              slug: { in: ['han-quoc', 'nhat-ban', 'trung-quoc', 'dai-loan'] },
            },
          },
        };
        break;

      case 'sinh-ton':
        whereCondition.countries = {
          some: {
            country: {
              slug: { in: ['nhat-ban', 'han-quoc', 'au-my'] },
            },
          },
        };
        break;

      case 'chua-lanh':
        delete whereCondition.type;
        break;
    }

    const movies = await this.prisma.movie.findMany({
      where: whereCondition,

      orderBy: [{ updatedAt: 'desc' }, { viewCount: 'desc' }],

      take: 8,
      select: this.select,
    });

    return this.formatMovie(movies);
  }
}
