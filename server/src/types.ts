import { Request } from 'express';

export interface User {
  id: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: User;
}
