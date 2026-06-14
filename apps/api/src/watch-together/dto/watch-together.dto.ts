import {
  createRoomSchema,
  GetRoomsSchema,
  joinRoomSchema,
} from '@workspace/shared/schema/room/room.dto';
import { createZodDto } from 'nestjs-zod';

export class createRoomyDto extends createZodDto(createRoomSchema) {}
export class joinRoomyDto extends createZodDto(joinRoomSchema) {}
export class GetRoomsSDto extends createZodDto(GetRoomsSchema) {}
