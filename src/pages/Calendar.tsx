
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTask } from "../contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "../components/layout/AppLayout";
import { Task } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const navigate = useNavigate();
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get days for the current month view
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Function to navigate to previous/next month
  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDueDate = new Date(task.dueDate);
      return isSameDay(taskDueDate, date);
    });
  };

  // Format day of week headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <Button onClick={() => navigate("/tasks/new")}>New Task</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekdays header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Add empty cells for days before the first of the month */}
              {Array.from({ length: firstDayOfMonth.getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="h-28 p-1 border border-border/30 bg-muted/40 rounded-md"></div>
              ))}

              {/* Actual days of the month */}
              {daysInMonth.map((day) => {
                const dayTasks = getTasksForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-28 p-1 border border-border rounded-md overflow-hidden",
                      !isCurrentMonth && "opacity-50 bg-muted/40",
                      isCurrentDay && "border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "text-right mb-1 text-sm font-medium",
                      isCurrentDay && "text-primary"
                    )}>
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-20">
                      {dayTasks.map((task) => (
                        <TaskItem 
                          key={task.id} 
                          task={task} 
                          onClick={() => navigate(`/tasks/${task.id}`)} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Add empty cells for days after the last of the month */}
              {Array.from({ length: 6 - lastDayOfMonth.getDay() }).map((_, i) => (
                <div key={`empty-end-${i}`} className="h-28 p-1 border border-border/30 bg-muted/40 rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

interface TaskItemProps {
  task: Task;
  onClick: () => void;
}

const TaskItem = ({ task, onClick }: TaskItemProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity",
        task.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : 
        task.priority === "medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : 
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      )}
    >
      {task.title}
    </div>
  );
};

export default Calendar;
