import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('top-views')
  async findTopViews() {
    return await this.moviesService.findTopViews();
  }
}
