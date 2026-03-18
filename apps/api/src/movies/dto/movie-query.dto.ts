import { createZodDto } from 'nestjs-zod';
import { MovieQuerySchema } from '@workspace/shared/schema/movie/movie.dto';

export class MovieQueryDto extends createZodDto(MovieQuerySchema) {}
