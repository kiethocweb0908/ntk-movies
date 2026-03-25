import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Prisma } from '@prisma/client';
import {
  MovieDetailResponse,
  MovieResponse,
} from '@workspace/shared/schema/movie/movie.response';

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
          select: { name: true },
        },
      },
    },
    countries: {
      select: {
        country: {
          select: { name: true },
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

  // thông tin diễn viên của phim
  private async getActorsByMovieId(movieId: string) {
    const data = await this.prisma.movieActor.findMany({
      where: { movieId },
      // include: { actor: true },
      select: {
        character: true,
        role: true,
        actor: {
          select: {
            id: true,
            tmdb_people_id: true,
            gender: true,
            name: true,
            originalName: true,
            profile_path: true,
          },
        },
      },
    });
    // Map lại để bỏ lớp trung gian "movieActor"
    return data.map((item) => ({
      id: item.actor.id,
      tmdb_people_id: item.actor.tmdb_people_id,
      gender: item.actor.gender,
      name: item.actor.name,
      originalName: item.actor.originalName,
      profile_path: item.actor.profile_path,
      character: item.character,
      role: item.role,
    }));
  }

  // server và tập phim
  private async getServersByMovieId(movieId: string) {
    const servers = await this.prisma.server.findMany({
      where: { movieId },
      include: {
        episodes: {
          where: { published: true },
          select: { name: true, slug: true, linkEmbed: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    return servers.map((server) => ({
      ...server,
      episodes: server.episodes.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      ),
    }));
  }

  // Các phim liên quan
  private async getRelatedMovies(
    currentId: string,
    categoryIds: string[],
    countryIds: string[],
    actorIds: string[],
  ) {
    const movies = await this.prisma.movie.findMany({
      where: {
        OR: [
          {
            actors: {
              some: { actorId: { in: actorIds } },
            },
          },
          {
            AND: [
              { categories: { some: { categoryId: { in: categoryIds } } } },
              { countries: { some: { countryId: { in: countryIds } } } },
            ],
          },
        ],
        id: { not: currentId },
        published: true,
      },
      take: 12,
      orderBy: [{ updatedAt: 'desc' }, { viewCount: 'desc' }],
      select: this.select,
    });

    return this.formatMovie(movies);
  }

  //---------------------------------------------
  //=============================================
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

  async getMovieDetail(slug: string): Promise<MovieDetailResponse> {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        categories: {
          select: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        countries: {
          select: {
            country: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        actors: { select: { actorId: true } },
      },
    });

    if (!movie) throw new NotFoundException('Phim không tồn tại');

    const actorIds = movie.actors.map((a) => a.actorId);
    const categoryIds = movie.categories.map((c) => c.category.id);
    const countryIds = movie.countries.map((c) => c.country.id);

    const { actors: _, ...movieWithoutActors } = movie;
    const formatedMovie = {
      ...movieWithoutActors,
      categories: movieWithoutActors.categories.map((c) => c.category),
      countries: movieWithoutActors.countries.map((c) => c.country),
    };

    const [actors, servers, related] = await Promise.all([
      this.getActorsByMovieId(movie.id),
      this.getServersByMovieId(movie.id),
      this.getRelatedMovies(
        formatedMovie.id,
        categoryIds,
        countryIds,
        actorIds,
      ),
    ]);

    return {
      movie: formatedMovie,
      actors,
      servers,
      related,
    };
  }
}
