import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CategoryService } from '../category/category.service';
import {
  AppResponse,
  EpisodeVideoResponse,
  MovieDetailResponse,
  MovieResponse,
  MoviesResponse,
  type MovieHomeData,
} from '@workspace/shared/schema/movie/movie.response';
import {
  MovieEpisodeDto,
  MovieMoodParamsDto,
  MovieQueryDto,
} from './dto/movie-query.dto';
import { type RequestWithUser } from '../types/auth.type';
import { NoCheckToken } from '../common/decorators/no-check-tonken.decorator';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('home')
  async getHomeData(): Promise<AppResponse<MovieHomeData>> {
    const [data, categories] = await Promise.all([
      this.moviesService.getHomeData(),
      this.categoryService.getHome(),
    ]);

    return {
      message: 'Thành công!',
      data: {
        ...data,
        categories,
      },
    };
  }

  @Get('mood/:moodId')
  async getMoviesByMood(
    @Param() params: MovieMoodParamsDto,
  ): Promise<AppResponse<MovieResponse[]>> {
    const movies = await this.moviesService.getMoviesByMood(params.moodId);

    return {
      message: 'Thành công!',
      data: movies,
    };
  }

  @Get('detail/:slug')
  async getDetail(
    @Param('slug') slug: string,
  ): Promise<AppResponse<MovieDetailResponse>> {
    const data = await this.moviesService.getMovieDetail(slug);

    return {
      message: 'Thành công!',
      data,
    };
  }

  @Get()
  async getMovies(
    @Query() query: MovieQueryDto,
  ): Promise<AppResponse<MoviesResponse>> {
    const data = await this.moviesService.getMovies(query);

    return {
      message: 'Lấy danh sách phim thành công!',
      data,
    };
  }

  @Get('episode')
  async getEpisode(
    @Request() req: RequestWithUser,
    @Query() query: MovieEpisodeDto,
  ): Promise<AppResponse<EpisodeVideoResponse>> {
    const data = await this.moviesService.getEpisode(query, req?.user?.id);

    return {
      message: 'Lấy tập phim thành công!',
      data,
    };
  }

  @Get('first-episode/:slugMovie')
  async firstEpisode(@Param('slugMovie') slugMovie: string) {
    const data = await this.moviesService.firstEpisode(slugMovie);

    return {
      message: 'Lấy tập phim thành công!',
      data,
    };
  }

  @NoCheckToken()
  @Post('update-view/:movieSlug')
  async updateView(@Param() param: { movieSlug: string }) {
    return await this.moviesService.updateView(param.movieSlug);
  }

  @NoCheckToken()
  @Get('keep-server')
  @HttpCode(HttpStatus.OK)
  async keepServer() {
    await this.moviesService.keepServer();
    return { status: 'alive', timestamp: new Date().toISOString() };
  }
}
