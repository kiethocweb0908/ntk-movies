import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Prisma } from '@prisma/client';
import {
  MovieDetailResponse,
  MovieResponse,
  MoviesResponse,
} from '@workspace/shared/schema/movie/movie.response';
import { MovieQuery } from '@workspace/shared/schema/movie/movie.dto';

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

  private async resolveFilterIds(params: {
    categorySlug?: string;
    countrySlug?: string;
  }) {
    const { categorySlug, countrySlug } = params;

    const [cat, cou] = await Promise.all([
      categorySlug
        ? this.prisma.category.findUnique({
            where: { slug: categorySlug },
            select: { id: true },
          })
        : null,

      countrySlug
        ? this.prisma.country.findUnique({
            where: { slug: countrySlug },
            select: { id: true },
          })
        : null,
    ]);

    return {
      categoryId: cat?.id,
      countryId: cou?.id,
      isValid: (!categorySlug || cat) && (!countrySlug || cou),
    };
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

  // Lấy phim cho trang home
  async getHomeData() {
    const [hanQuoc, trungQuoc, auMy, kinhDi] = await Promise.all([
      this.prisma.country.findUnique({
        where: { slug: 'han-quoc' },
        select: { id: true },
      }),
      this.prisma.country.findUnique({
        where: { slug: 'trung-quoc' },
        select: { id: true },
      }),
      this.prisma.country.findUnique({
        where: { slug: 'au-my' },
        select: { id: true },
      }),
      this.prisma.category.findUnique({
        where: { slug: 'kinh-di' },
        select: { id: true },
      }),
    ]);

    const baseWhere = { published: true };

    const queries = [
      // hero
      this.prisma.movie.findMany({
        where: baseWhere,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // korean
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          countries: { some: { countryId: hanQuoc?.id } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // chinese
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          countries: { some: { countryId: trungQuoc?.id } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // usuk
      this.prisma.movie.findMany({
        where: { ...baseWhere, countries: { some: { countryId: auMy?.id } } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // horror
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          categories: { some: { categoryId: kinhDi?.id } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // topViewHorror
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          categories: { some: { categoryId: kinhDi?.id } },
        },
        take: 8,
        orderBy: [{ viewCount: 'desc' }, { imdb_vote_average: 'desc' }],
        select: this.select,
      }),

      // chieurap
      this.prisma.movie.findMany({
        where: { ...baseWhere, chieurap: true },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // topViewChieurap
      this.prisma.movie.findMany({
        where: { ...baseWhere, chieurap: true },
        take: 8,
        orderBy: [{ viewCount: 'desc' }, { imdb_vote_average: 'desc' }],
        select: this.select,
      }),
    ];

    const [
      hero,
      korean,
      chinese,
      usuk,
      horror,
      topViewHorror,
      chieurap,
      topViewChieurap,
    ] = await Promise.all(queries);

    return {
      hero: this.formatMovie(hero),
      korean: this.formatMovie(korean),
      chinese: this.formatMovie(chinese),
      usuk: this.formatMovie(usuk),
      horror: this.formatMovie(horror),
      topViewHorror: this.formatMovie(topViewHorror),
      chieurap: this.formatMovie(chieurap),
      topViewChieurap: this.formatMovie(topViewChieurap),
    };
  }

  // Lấy phim theo mood
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

  // Lấy chi tiết phim
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

  // Lấy danh sách phim có lọc, phân trang, search
  async getMovies(query: MovieQuery): Promise<MoviesResponse> {
    const {
      categorySlug,
      countrySlug,
      type,
      year,
      page = 1,
      limit = 32,
      sort,
      search,
    } = query;

    const skip = (page - 1) * limit;

    const { categoryId, countryId, isValid } = await this.resolveFilterIds({
      categorySlug,
      countrySlug,
    });

    if (!isValid) {
      return {
        movies: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const where: Prisma.MovieWhereInput = {
      published: true,
      ...(type && { type }),
      ...(year && { year }),
      ...(categoryId && { categories: { some: { categoryId } } }),
      ...(countryId && { countries: { some: { countryId } } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { originName: { contains: search, mode: 'insensitive' } },
          { alternativeNames: { hasSome: [search] } },
        ],
      }),
    };

    const orderBy: Prisma.MovieOrderByWithRelationInput =
      sort === 'viewCount' ? { viewCount: 'desc' } : { createdAt: 'desc' };

    const [movies, totalCount] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        select: this.select,
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      movies: this.formatMovie(movies),
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
