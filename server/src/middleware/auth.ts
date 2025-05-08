import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 