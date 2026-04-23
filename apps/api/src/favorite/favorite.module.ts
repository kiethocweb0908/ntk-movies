import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
