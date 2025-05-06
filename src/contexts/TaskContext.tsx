
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, Priority, Status, Notification } from "../types";
import { mockTasks, mockNotifications, generateId } from "../lib/mockData";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface TaskContextType {
  tasks: Task[];
  notifications: Notification[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "createdBy">) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTask: (taskId: string) => Task | undefined;
  assignTask: (taskId: string, userId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  getTasksByFilter: (filter: TaskFilter) => Task[];
  clearAllNotifications: () => void;
}

export type TaskFilter = {
  status?: Status;
  priority?: Priority;
  assignedToMe?: boolean;
  createdByMe?: boolean;
  overdue?: boolean;
  search?: string;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load tasks on mount and when user changes
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch from API
      setTasks(mockTasks);
      setNotifications(mockNotifications);
    } else {
      setTasks([]);
      setNotifications([]);
    }
  }, [user]);

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "createdBy">) => {
    if (!user) return Promise.reject("Not authenticated");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTask: Task = {
      id: generateId("t"),
      ...taskData,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    // Add to state (in a real app, this would be a response from the server)
    setTasks((prevTasks) => [...prevTasks, newTask]);

    // If assigned to someone, create notification
    if (taskData.assignedTo && taskData.assignedTo !== user.id) {
      const newNotification: Notification = {
        id: generateId("n"),
        type: "task_assigned",
        taskId: newTask.id,
        message: `${user.name} assigned you a new task: ${newTask.title}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }

    toast.success("Task created successfully");
    return Promise.resolve();
  };

  const updateTask = async (task: Task) => {
    if (!user) return Promise.reject("Not authenticated");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update in state (in a real app, this would be a response from the server)
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? task : t))
    );

    toast.success("Task updated successfully");
    return Promise.resolve();
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return Promise.reject("Not authenticated");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Remove from state (in a real app, this would be a response from the server)
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    
    // Also remove related notifications
    setNotifications((prevNotifications) => 
      prevNotifications.filter((n) => n.taskId !== taskId)
    );

    toast.success("Task deleted successfully");
    return Promise.resolve();
  };

  const getTask = (taskId: string) => {
    return tasks.find((task) => task.id === taskId);
  };

  const assignTask = async (taskId: string, userId: string) => {
    if (!user) return Promise.reject("Not authenticated");

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return Promise.reject("Task not found");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedTask = { ...task, assignedTo: userId };

    // Update in state
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
    );

    // Create notification for assignee
    if (userId !== user.id) {
      const newNotification: Notification = {
        id: generateId("n"),
        type: "task_assigned",
        taskId: taskId,
        message: `${user.name} assigned you a task: ${task.title}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }

    toast.success("Task assigned successfully");
    return Promise.resolve();
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info("All notifications cleared");
  };

  const getTasksByFilter = (filter: TaskFilter): Task[] => {
    if (!user) return [];

    return tasks.filter((task) => {
      // Search filter
      if (
        filter.search &&
        !task.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !task.description.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (filter.status && task.status !== filter.status) {
        return false;
      }

      // Priority filter
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }

      // Assigned to me filter
      if (filter.assignedToMe && task.assignedTo !== user.id) {
        return false;
      }

      // Created by me filter
      if (filter.createdByMe && task.createdBy !== user.id) {
        return false;
      }

      // Overdue filter
      if (filter.overdue && task.dueDate) {
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        if (!(dueDate < now && task.status !== "done")) {
          return false;
        }
      }

      return true;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        notifications,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        assignTask,
        markNotificationAsRead,
        getTasksByFilter,
        clearAllNotifications,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
