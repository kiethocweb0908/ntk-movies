import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CategoryService } from '../category/category.service';
import { type MovieHome } from '@workspace/shared/schema/movie/movie.response';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('home')
  async getHomeData(): Promise<MovieHome> {
    const [hero, korean, chienese, usuk, horror, chieurap, categories] =
      await Promise.all([
        this.moviesService.getHomeByQuery({ limit: 5 }),
        this.moviesService.getHomeByQuery({ country: 'han-quoc' }),
        this.moviesService.getHomeByQuery({ country: 'trung-quoc' }),
        this.moviesService.getHomeByQuery({ country: 'au-my' }),
        this.moviesService.getHomeByQuery({ category: 'kinh-di' }),
        this.moviesService.getHomeByQuery({ chieurap: true }),
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
        chieurap,
        categories,
      },
    };
  }
}
