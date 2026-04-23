import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  EpisodeVideoResponse,
  MovieDetailResponse,
  MovieResponse,
  MoviesResponse,
} from '@workspace/shared/schema/movie/movie.response';
import {
  MovieEpisode,
  MovieQuery,
} from '@workspace/shared/schema/movie/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  select = {
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

  formatMovie(movies) {
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
          select: { name: true, slug: true },
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
    slug: string,
    oriName: string | null,
    name: string,
    categoryIds: string[],
    countryIds: string[],
  ) {
    const kwSlug = this.getRootKeyword(slug.replace(/-/g, ' ')).replace(
      /\s+/g,
      '-',
    );
    const kwOri = this.getRootKeyword(oriName || '');
    const kwName = this.getRootKeyword(name);

    const specialKeywords = [
      'chien-doi',
      'chien-binh',
      'sieu-nhan',
      'hiep-si-mat-na',
      'kamen-rider',
    ];
    const isSpecial = specialKeywords.some((sk) =>
      kwSlug.toLowerCase().includes(sk),
    );

    let nameFilter: Prisma.MovieWhereInput;

    if (isSpecial) {
      nameFilter = {
        OR: [
          { originName: { contains: kwOri, mode: 'insensitive' } },
          {
            AND: [
              { slug: { contains: kwSlug, mode: 'insensitive' } },
              { name: { contains: kwName, mode: 'insensitive' } },
            ],
          },
        ],
      };
    } else {
      nameFilter = kwOri
        ? { originName: { contains: kwOri, mode: 'insensitive' } }
        : { slug: { contains: kwSlug, mode: 'insensitive' } };
    }

    const similarNameMovies = await this.prisma.movie.findMany({
      where: {
        id: { not: currentId },
        published: true,
        ...nameFilter,
      },
      take: 12,
      orderBy: [{ updatedAt: 'desc' }, { viewCount: 'desc' }],
      select: this.select,
    });

    if (similarNameMovies.length === 12) {
      return this.formatMovie(similarNameMovies);
    }

    const similarIds = similarNameMovies.map((m) => m.id);
    const categoryMovies = await this.prisma.movie.findMany({
      where: {
        id: { notIn: [currentId, ...similarIds] },
        published: true,
        AND: [
          { categories: { some: { categoryId: { in: categoryIds } } } },
          { countries: { some: { countryId: { in: countryIds } } } },
        ],
      },
      take: 12 - similarNameMovies.length,
      orderBy: [{ updatedAt: 'desc' }, { viewCount: 'desc' }],
      select: this.select,
    });

    return this.formatMovie([...similarNameMovies, ...categoryMovies]);
  }

  // trích xuất từ khoá
  private getRootKeyword(input: string): string {
    if (!input) return '';

    const regex = /[:\(\[|]|(\s+season\s+)|(\s+phần\s+)/i;

    const hasSpecialChar = regex.test(input);

    if (hasSpecialChar) {
      const parts = input.split(regex);
      return parts[0].trim();
    }

    const words = input.trim().split(/\s+/);
    if (words.length > 2) {
      return words.slice(0, 2).join(' ');
    }

    return input.trim();
  }

  //---------------------------------------------
  //=============================================
  //---------------------------------------------

  // Lấy phim cho trang home
  async getHomeData() {
    const baseWhere = { published: true };

    const queries = [
      // hero
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          countries: { none: { country: { slug: 'thai-lan' } } },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // korean
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          countries: { some: { country: { slug: 'han-quoc' } } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // chinese
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          countries: { some: { country: { slug: 'trung-quoc' } } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // usuk
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          countries: { some: { country: { slug: 'au-my' } } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // horror
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          categories: { some: { category: { slug: 'kinh-di' } } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // topViewHorror
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          categories: { some: { category: { slug: 'kinh-di' } } },
        },
        take: 8,
        orderBy: [{ viewCount: 'desc' }, { imdb_vote_average: 'desc' }],
        select: this.select,
      }),

      // anime
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          type: 'hoathinh',
          countries: { some: { country: { slug: 'nhat-ban' } } },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: this.select,
      }),

      // topViewAnime
      this.prisma.movie.findMany({
        where: {
          ...baseWhere,
          type: 'hoathinh',
          countries: { some: { country: { slug: 'nhat-ban' } } },
        },
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
      anime,
      topViewAnime,
    ] = await Promise.all(queries);

    return {
      hero: this.formatMovie(hero),
      korean: this.formatMovie(korean),
      chinese: this.formatMovie(chinese),
      usuk: this.formatMovie(usuk),
      horror: this.formatMovie(horror),
      topViewHorror: this.formatMovie(topViewHorror),
      anime: this.formatMovie(anime),
      topViewAnime: this.formatMovie(topViewAnime),
    };
  }

  // Lấy phim theo mood
  async getMoviesByMood(moodId: string): Promise<MovieResponse[]> {
    const pinnedSlugs = [
      'the-gioi-khong-loi-thoat',
      'tro-choi-con-muc',
      'vung-dat-cam-lang',
      'xac-song',
      'the-chien-z',
      'chuyen-tau-sinh-tu',
    ];

    let pinnedMovies: any = [];

    if (moodId === 'sinh-ton') {
      pinnedMovies = await this.prisma.movie.findMany({
        where: {
          slug: { in: pinnedSlugs },
          published: true,
        },
        select: this.select,
      });
    }

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

    const remainingCount = 8 - pinnedMovies.length;
    let remainingMovies: any = [];

    if (remainingCount > 0) {
      remainingMovies = await this.prisma.movie.findMany({
        where: whereCondition,
        orderBy: [{ updatedAt: 'desc' }, { viewCount: 'desc' }],
        take: remainingCount,
        select: this.select,
      });
    }

    return this.formatMovie([...pinnedMovies, ...remainingMovies]);
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
        // actors: { select: { actorId: true } },
      },
    });

    if (!movie) throw new NotFoundException('Phim không tồn tại');

    const categoryIds = movie.categories.map((c) => c.category.id);
    const countryIds = movie.countries.map((c) => c.country.id);

    // const { actors: _, ...movieWithoutActors } = movie;
    const formatedMovie = {
      ...movie,
      categories: movie.categories.map((c) => c.category),
      countries: movie.countries.map((c) => c.country),
    };

    const [
      // actors,
      servers,
      related,
    ] = await Promise.all([
      // this.getActorsByMovieId(movie.id),
      this.getServersByMovieId(movie.id),
      this.getRelatedMovies(
        formatedMovie.id,
        formatedMovie.slug,
        formatedMovie.originName,
        formatedMovie.name,
        categoryIds,
        countryIds,
      ),
    ]);

    return {
      movie: formatedMovie,
      // actors,
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

  async getEpisode(
    { episodeSlug, movieSlug, serverId }: MovieEpisode,
    userId: string | undefined,
  ): Promise<EpisodeVideoResponse> {
    const whereCondition: Prisma.EpisodeWhereInput = {
      slug: episodeSlug,
      server: {
        movie: { slug: movieSlug },
      },
    };

    if (serverId) {
      whereCondition.server!.id = serverId;
    }

    const episode = await this.prisma.episode.findFirst({
      where: whereCondition,
      orderBy: {
        server: { createdAt: 'asc' },
      },
      select: {
        linkEmbed: true,
        linkM3u8: true,
        name: true,
        id: true,
        ...(userId && {
          history: {
            where: { userId },
            select: {
              duration: true,
              currentTime: true,
              isCompleted: true,
            },
            take: 1,
          },
        }),
      },
    });
    if (!episode) throw new NotFoundException('Tập phim không tồn tại');
    return {
      ...episode,
      history: episode.history?.[0] || null,
    };
  }

  async firstEpisode(slugMovie: string) {
    const movie = await this.prisma.movie.findFirst({
      where: { slug: slugMovie },
      select: {
        servers: {
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: {
            id: true,
            episodes: {
              orderBy: { slug: 'asc' },
              take: 1,
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    if (
      !movie ||
      movie.servers.length === 0 ||
      movie.servers[0].episodes.length === 0
    ) {
      throw new NotFoundException('Không tìm thấy tập phim');
    }

    return {
      serverId: movie.servers[0].id,
      episodeSlug: movie.servers[0].episodes[0].slug,
    };
  }

  async updateView(movieSlug: string) {
    try {
      const updatedMovie = await this.prisma.movie.update({
        where: {
          slug: movieSlug,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
        select: {
          id: true,
          name: true,
          viewCount: true,
        },
      });

      return updatedMovie;
    } catch (error) {
      throw new NotFoundException(`Không tìm thấy phim với slug: ${movieSlug}`);
    }
  }
}
