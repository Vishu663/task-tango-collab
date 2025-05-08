import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Task, Priority, Status, Notification } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import axios from "axios";

const API_URL =
  "https://task-tango-backend-bdlcum2x4-vishu663s-projects.vercel.app/api";

interface TaskContextType {
  tasks: Task[];
  notifications: Notification[];
  addTask: (
    task: Omit<Task, "_id" | "createdAt" | "createdBy">
  ) => Promise<void>;
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

  // Load tasks and notifications on mount and when user changes
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("taskTangoToken");
          if (!token) {
            throw new Error("No authentication token found");
          }

          // Fetch tasks
          const tasksResponse = await fetch(`${API_URL}/tasks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!tasksResponse.ok) {
            throw new Error("Failed to fetch tasks");
          }

          const tasksData = await tasksResponse.json();
          setTasks(tasksData);

          // Fetch notifications
          const notificationsResponse = await fetch(
            `${API_URL}/notifications`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!notificationsResponse.ok) {
            throw new Error("Failed to fetch notifications");
          }

          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to fetch data");
        }
      } else {
        setTasks([]);
        setNotifications([]);
      }
    };

    fetchData();
  }, [user]);

  const addTask = async (
    taskData: Omit<Task, "_id" | "createdAt" | "createdBy">
  ) => {
    if (!user) return Promise.reject("Not authenticated");

    try {
      const token = localStorage.getItem("taskTangoToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
      }

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);

      // Fetch updated notifications after task creation
      const notificationsResponse = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);
      }

      toast.success("Task created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task"
      );
      throw error;
    }
  };

  const updateTask = async (task: Task) => {
    if (!user) return Promise.reject("Not authenticated");

    try {
      const token = localStorage.getItem("taskTangoToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
      );
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task"
      );
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return Promise.reject("Not authenticated");

    try {
      const token = localStorage.getItem("taskTangoToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete task"
      );
      throw error;
    }
  };

  const getTask = (taskId: string) => {
    return tasks.find((task) => task._id === taskId);
  };

  const assignTask = async (taskId: string, userId: string): Promise<Task> => {
    if (!user) return Promise.reject("Not authenticated");

    try {
      const token = localStorage.getItem("taskTangoToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo: userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? updatedTask : t))
      );
      toast.success("Task assigned successfully");
      return updatedTask;
    } catch (error) {
      console.error("Failed to assign task:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to assign task"
      );
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await axios.patch(
        `${API_URL}/notifications/${notificationId}`
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? response.data : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem("taskTangoToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/notifications`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to clear notifications");
      }

      setNotifications([]);
      toast.success("All notifications cleared successfully");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to clear notifications"
      );
    }
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
      if (filter.assignedToMe && task.assignedTo !== user._id) {
        return false;
      }

      // Created by me filter
      if (filter.createdByMe && task.createdBy !== user._id) {
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
