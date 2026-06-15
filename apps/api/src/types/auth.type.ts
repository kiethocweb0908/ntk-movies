import { Request } from 'express';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';

export interface RequestWithUser extends Request {
  user: User & { role: { slug: string } }; // Ghi đè hoặc thêm thuộc tính user
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  avatarId: string | null;
  role: string;
}

export interface CustomSocket extends Socket {
  data: {
    user: AuthenticatedUser;
  };
}
