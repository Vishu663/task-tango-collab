
import { User, Task, Notification, Priority, Status } from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=John+Doe&background=6D28D9&color=fff"
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Jane+Smith&background=6D28D9&color=fff"
  },
  {
    id: "u3",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6D28D9&color=fff"
  }
];

// Current user for demo purposes
export const currentUser: User = mockUsers[0];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Implement User Authentication",
    description: "Create login and registration endpoints with JWT integration",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    status: "in-progress",
    createdBy: "u1",
    assignedTo: "u2"
  },
  {
    id: "t2",
    title: "Design Dashboard Layout",
    description: "Create wireframes and mockups for the main dashboard interface",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    status: "todo",
    createdBy: "u1"
  },
  {
    id: "t3",
    title: "API Documentation",
    description: "Document all API endpoints and request/response schemas",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "low",
    status: "todo",
    createdBy: "u2",
    assignedTo: "u1"
  },
  {
    id: "t4",
    title: "Fix Navigation Bug",
    description: "Fix the navigation menu collapses incorrectly on mobile devices",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    status: "review",
    createdBy: "u3",
    assignedTo: "u1"
  },
  {
    id: "t5",
    title: "Update User Settings",
    description: "Implement user profile and settings screens",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    status: "done",
    createdBy: "u1",
    assignedTo: "u1"
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "task_assigned",
    taskId: "t1",
    message: "Jane Smith assigned you a new task: Implement User Authentication",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: "n2",
    type: "task_deadline",
    taskId: "t2",
    message: "Task 'Design Dashboard Layout' is overdue",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: "n3",
    type: "task_updated",
    taskId: "t3",
    message: "Alex Johnson updated task: API Documentation",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false
  }
];

// Helper function to generate ID
export const generateId = (prefix: string): string => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
};

// Priority and Status options
export const priorityOptions: { label: string; value: Priority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" }
];

export const statusOptions: { label: string; value: Status }[] = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" }
];
