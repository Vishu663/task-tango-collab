
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Task } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow, format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { getUser } = useAuth();
  const creator = getUser(task.createdBy);
  const assignee = task.assignedTo ? getUser(task.assignedTo) : undefined;
  
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';

  return (
    <Card 
      className={`${onClick ? "cursor-pointer hover:border-primary/50 transition-colors" : ""} overflow-hidden`}
      onClick={onClick}
    >
      <div className={`h-1 w-full ${getPriorityClass(task.priority)}`}></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          </div>
          <Badge className={`${getStatusClass(task.status)} ml-2`}>
            {getStatusLabel(task.status)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-muted/50 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          {assignee ? (
            <div className="flex items-center">
              <Avatar className="h-5 w-5 mr-1">
                <AvatarImage src={assignee.avatarUrl} />
                <AvatarFallback className="text-[10px]">{assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>Assigned to {assignee.name}</span>
            </div>
          ) : (
            <span>Unassigned</span>
          )}
        </div>
        {task.dueDate && (
          <div className={`${isOverdue ? "text-destructive font-medium" : ""}`}>
            {isOverdue ? "Overdue" : "Due"}: {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

function getPriorityClass(priority: string): string {
  switch (priority) {
    case "low":
      return "bg-green-500";
    case "medium":
      return "bg-amber-500";
    case "high":
      return "bg-red-500";
    default:
      return "bg-slate-500";
  }
}

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

export default TaskCard;
