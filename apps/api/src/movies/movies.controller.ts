import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CategoryService } from '../category/category.service';
import {
  AppResponse,
  MovieDetailResponse,
  MovieMood,
  MoviesResponse,
  type MovieHomeData,
} from '@workspace/shared/schema/movie/movie.response';
import { MovieMoodParamsDto, MovieQueryDto } from './dto/movie-query.dto';

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
      status: true,
      data: {
        ...data,
        categories,
      },
    };
  }

  @Get('mood/:moodId')
  async getMoviesByMood(
    @Param() params: MovieMoodParamsDto,
  ): Promise<MovieMood> {
    console.log(params.moodId);
    const movies = await this.moviesService.getMoviesByMood(params.moodId);

    return {
      message: 'Thành công!',
      status: true,
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
      status: true,
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
      status: true,
      data,
    };
  }
}
