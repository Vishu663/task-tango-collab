import express, { Request, Response, NextFunction, Router } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User, IUser } from './models/User';
import { Task } from './models/Task';
import { Notification } from './models/Notification';

// Custom AuthRequest type
export interface AuthRequest extends Request {
  user?: IUser; // Add the user property
}

// Load environment variables
dotenv.config();

const app = express();
const router = Router();

// Middleware
app.use(cors({
  origin: 'https://task-tango-frontend.vercel.app',
  credentials: true, 
}));
app.use(express.json());

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => ('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Authentication middleware
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { name: !name, email: !email, password: !password }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create new user
    const user = new User({ 
      name, 
      email, 
      password,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6D28D9&color=fff`
    });

    await user.save();
    // Generate token
    const token = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Convert to plain object and remove password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    res.status(201).json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/auth/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
    
    const token = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Convert to plain object and remove password
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Protected routes
app.use('/api/tasks', auth);
app.use('/api/users', auth);
app.use('/api/notifications', auth);

app.get('/api/tasks', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const tasks = await Task.find({ createdBy: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/tasks', async (req: AuthRequest, res: Response) => {
  try {
    
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });
    
    await task.save();

    // Create notifications for all users
    const users = await User.find({});
    
    const notifications = users.map(user => ({
      message: `New task "${task.title}" has been created`,
      taskId: task._id,
      userId: user._id,
      timestamp: new Date()
    }));

    await Notification.insertMany(notifications);
    
    // Populate the task data before sending response
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({ 
      error: 'Failed to create task',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.patch('/api/tasks/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Failed to update task:', error);
    res.status(400).json({ 
      error: 'Failed to update task',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/tasks/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ 
      error: 'Failed to delete task',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all users
app.get('/api/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's notifications
router.get('/notifications', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const notifications = await Notification.find({ userId: req.user._id })
      .populate({
        path: 'populatedTaskId',
        select: '_id title description status priority'
      })
      .lean()
      .sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/notifications/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    )
      .populate({
        path: 'populatedTaskId',
        select: '_id title description status priority'
      })
      .lean();

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Clear all notifications
router.delete('/notifications', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// Task assignment endpoint
app.patch('/api/tasks/:id/assign', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(400).json({ error: 'Assignee ID is required' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email')
     .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Create notification for the assignee
    const notification = new Notification({
      message: `You have been assigned to task "${task.title}"`,
      taskId: task._id,
      userId: assignedTo,
      timestamp: new Date()
    });
    await notification.save();

    res.json(task);
  } catch (error) {
    console.error('Failed to assign task:', error);
    res.status(400).json({ 
      error: 'Failed to assign task',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Clear all notifications endpoint
app.delete('/api/notifications', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'All notifications cleared successfully' });
  } catch (error) {
    console.error('Failed to clear notifications:', error);
    res.status(500).json({ 
      error: 'Failed to clear notifications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('API is running');
});

// Mount the router
app.use('/api', router);

// Apply error handling middleware
app.use(errorHandler);

console.log("server is running");