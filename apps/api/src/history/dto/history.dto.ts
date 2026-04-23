import {
  UpdateHistorySchema,
  HistoyryQuerySchema,
} from '@workspace/shared/schema/history/history.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateHistoryDto extends createZodDto(UpdateHistorySchema) {}
export class HistoyryQueryDto extends createZodDto(HistoyryQuerySchema) {}
