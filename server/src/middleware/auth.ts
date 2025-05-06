import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    console.log('Auth middleware - Token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    console.log('Auth middleware - Decoded token:', decoded);

    const user = await User.findOne({ _id: decoded._id });
    console.log('Auth middleware - Found user:', user ? user._id : 'No user found');

    if (!user) {
      console.log('Auth middleware - User not found');
      return res.status(401).json({ error: 'Please authenticate.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 