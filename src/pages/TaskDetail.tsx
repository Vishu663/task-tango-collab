
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "../contexts/TaskContext";
import { useAuth } from "../contexts/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Task } from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { priorityOptions, statusOptions } from "../lib/mockData";

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, updateTask, deleteTask, assignTask } = useTask();
  const { user, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const allUsers = getAllUsers();

  useEffect(() => {
    if (taskId) {
      const currentTask = getTask(taskId);
      if (!currentTask) {
        navigate("/tasks");
        return;
      }
      setTask(currentTask);
    }
  }, [taskId, getTask, navigate]);

  if (!task) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  const creator = allUsers.find(u => u.id === task.createdBy);
  const assignee = task.assignedTo ? allUsers.find(u => u.id === task.assignedTo) : undefined;
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const handleStatusChange = async (status: string) => {
    if (task) {
      setIsLoading(true);
      try {
        await updateTask({ ...task, status: status as any });
        setTask({ ...task, status: status as any });
        toast.success("Task status updated");
      } catch (error) {
        toast.error("Failed to update task status");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (task) {
      setIsLoading(true);
      try {
        await updateTask({ ...task, priority: priority as any });
        setTask({ ...task, priority: priority as any });
        toast.success("Task priority updated");
      } catch (error) {
        toast.error("Failed to update task priority");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    if (task) {
      setIsLoading(true);
      try {
        await assignTask(task.id, userId);
        setTask({ ...task, assignedTo: userId });
        toast.success("Task assigned successfully");
      } catch (error) {
        toast.error("Failed to assign task");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to delete task");
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Task Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusClass(task.status)}>
                {getStatusLabel(task.status)}
              </Badge>
              <Badge className={getPriorityClass(task.priority)}>
                {getPriorityLabel(task.priority)}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive">Overdue</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/tasks/edit/${task.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteTask}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Task Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{task.description}</p>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-muted rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(task.createdAt), "PPP")}
                      </div>
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-start">
                      <div className="mr-3 p-2 bg-muted rounded-full">
                        <Clock className={`h-5 w-5 ${isOverdue ? "text-destructive" : "text-primary"}`} />
                      </div>
                      <div>
                        <div className="font-medium">Due date</div>
                        <div className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                          {format(new Date(task.dueDate), "PPP")}
                          {isOverdue && " (Overdue)"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={task.priority}
                  onValueChange={handlePriorityChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* People */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creator */}
                {creator && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Created by</div>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={creator.avatarUrl} />
                        <AvatarFallback>
                          {creator.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{creator.name}</span>
                    </div>
                  </div>
                )}

                {/* Assignee */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Assigned to</div>
                  <Select
                    value={task.assignedTo || ""}
                    onValueChange={handleAssigneeChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {allUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function getStatusClass(status: string): string {
  switch (status) {
    case "todo":
      return "status-todo";
    case "in-progress":
      return "status-in-progress";
    case "review":
      return "status-review";
    case "done":
      return "status-done";
    default:
      return "";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "review":
      return "Review";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function getPriorityClass(priority: string): string {
  switch (priority) {
    case "low":
      return "priority-low";
    case "medium":
      return "priority-medium";
    case "high":
      return "priority-high";
    default:
      return "";
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    default:
      return priority;
  }
}

export default TaskDetail;
