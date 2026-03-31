import { createZodDto } from 'nestjs-zod';
import {
  MovieEpisodeSchema,
  MovieMoodSchema,
  MovieQuerySchema,
} from '@workspace/shared/schema/movie/movie.dto';

export class MovieQueryDto extends createZodDto(MovieQuerySchema) {}
export class MovieMoodParamsDto extends createZodDto(MovieMoodSchema) {}
export class MovieEpisodeDto extends createZodDto(MovieEpisodeSchema) {}
