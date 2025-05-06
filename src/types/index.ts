export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  createdBy: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  message: string;
  taskId: string;
  userId: string;
  read: boolean;
  timestamp: string;
  populatedTaskId?: {
    _id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} 