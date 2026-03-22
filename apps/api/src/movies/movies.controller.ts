import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CategoryService } from '../category/category.service';
import {
  MovieMood,
  type MovieHome,
} from '@workspace/shared/schema/movie/movie.response';
import { MovieMoodParamsDto } from './dto/movie-query.dto';
import { prisma } from '@/prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('home')
  async getHomeData(): Promise<MovieHome> {
    const [
      hero,
      korean,
      chienese,
      usuk,
      horror,
      topViewHorror,
      chieurap,
      topViewChieurap,
      categories,
    ] = await Promise.all([
      this.moviesService.getHomeByQuery({ limit: 5 }),
      this.moviesService.getHomeByQuery({ country: 'han-quoc' }),
      this.moviesService.getHomeByQuery({ country: 'trung-quoc' }),
      this.moviesService.getHomeByQuery({ country: 'au-my' }),
      this.moviesService.getHomeByQuery({ category: 'kinh-di' }),
      this.moviesService.getHomeByQuery({
        category: 'kinh-di',
        featured: true,
        limit: 8,
      }),
      this.moviesService.getHomeByQuery({ chieurap: true }),
      this.moviesService.getHomeByQuery({
        chieurap: true,
        featured: true,
        limit: 8,
      }),
      this.categoryService.getHome(),
    ]);

    return {
      message: 'Thành công!',
      status: true,
      data: {
        hero,
        korean,
        chienese,
        usuk,
        horror,
        topViewHorror,
        chieurap,
        topViewChieurap,
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
}
