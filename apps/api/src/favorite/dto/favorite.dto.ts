import { HistoyryQuerySchema } from '@workspace/shared/schema/history/history.dto';
import { MovieFavoriteSchema } from '@workspace/shared/schema/movie/movie.dto';
import { createZodDto } from 'nestjs-zod';

export class FavoriteQueryDto extends createZodDto(HistoyryQuerySchema) {}
export class MovieFavoriteDto extends createZodDto(MovieFavoriteSchema) {}
