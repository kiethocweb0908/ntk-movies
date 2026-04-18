import { UpdateHistorySchema } from '@workspace/shared/schema/history/history.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateHistoryDto extends createZodDto(UpdateHistorySchema) {}
