
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';

export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  createdBy: string;
  assignedTo?: string;
};

export type Notification = {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'task_deadline';
  taskId: string;
  message: string;
  timestamp: string;
  read: boolean;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
