import { createZodDto } from 'nestjs-zod';
import {
  MovieMoodSchema,
  MovieQuerySchema,
} from '@workspace/shared/schema/movie/movie.dto';

export class MovieQueryDto extends createZodDto(MovieQuerySchema) {}
export class MovieMoodParamsDto extends createZodDto(MovieMoodSchema) {}
