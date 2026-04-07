import { Request } from 'express';
import { User } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: User & { role: { slug: string } }; // Ghi đè hoặc thêm thuộc tính user
}
