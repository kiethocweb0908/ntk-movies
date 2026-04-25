import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AtGuard } from '../common/guards/auth.guard';
import { type RequestWithUser } from '../types/auth.type';
import { FavoriteQueryDto, MovieFavoriteDto } from './dto/favorite.dto';
import { AppResponse } from '@workspace/shared/schema/movie/movie.response';
import { FavoritesResponse } from '@workspace/shared/schema/favorite/favorite.response';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  // @UseGuards(AtGuard)
  async getFavorites(
    @Req() req: RequestWithUser,
    @Query() query: FavoriteQueryDto,
  ): Promise<AppResponse<FavoritesResponse>> {
    const data = await this.favoriteService.getUserFavorites(
      req.user.id,
      query,
    );
    return {
      message: 'Thành công!',
      data,
    };
  }

  @Post('/:movieId')
  // @UseGuards(AtGuard)
  async updateFavorite(
    @Req() req: RequestWithUser,
    @Param() param: MovieFavoriteDto,
  ) {
    return await this.favoriteService.updateFavorite(
      req.user.id,
      param.movieId,
    );
  }
}
