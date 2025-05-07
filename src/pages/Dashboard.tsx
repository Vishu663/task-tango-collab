
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useTask, TaskFilter } from "../contexts/TaskContext";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  ListCheck,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import TaskCard from "../components/tasks/TaskCard";

const Dashboard = () => {
  const { user } = useAuth();
  const { getTasksByFilter } = useTask();
  const navigate = useNavigate();

  // Get tasks by different filters
  const assignedTasks = getTasksByFilter({ assignedToMe: true });
  const createdTasks = getTasksByFilter({ createdByMe: true });
  const overdueTasks = getTasksByFilter({ overdue: true });
  const recentTasks = [...getTasksByFilter({})].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <Button onClick={() => navigate("/tasks/new")} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            icon={<UserIcon className="h-5 w-5" />}
            title="Assigned to me"
            value={assignedTasks.length.toString()}
            description="Tasks assigned to you"
            onClick={() => navigate("/tasks?assignedToMe=true")}
          />
          <DashboardCard
            icon={<ListCheck className="h-5 w-5" />}
            title="Created by me"
            value={createdTasks.length.toString()}
            description="Tasks you've created"
            onClick={() => navigate("/tasks?createdByMe=true")}
          />
          <DashboardCard
            icon={<ClockIcon className="h-5 w-5" />}
            title="Overdue"
            value={overdueTasks.length.toString()}
            description="Overdue tasks"
            onClick={() => navigate("/tasks?overdue=true")}
            alert={overdueTasks.length > 0}
          />
          <DashboardCard
            icon={<CalendarIcon className="h-5 w-5" />}
            title="Upcoming"
            value={getTasksByFilter({ status: "todo" }).length.toString()}
            description="Todo tasks"
            onClick={() => navigate("/tasks?status=todo")}
          />
        </div>

        {/* Recent Tasks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Button variant="outline" onClick={() => navigate("/tasks")}>
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No tasks yet. Create your first task to get started!</p>
                  <Button onClick={() => navigate("/tasks/new")} className="mt-4">
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              recentTasks.map((task) => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onClick={() => navigate(`/tasks/${task._id}`)} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  alert?: boolean;
  onClick?: () => void;
}

const DashboardCard = ({ icon, title, value, description, alert, onClick }: DashboardCardProps) => {
  return (
    <Card className={`${onClick ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}`} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${alert ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-muted"}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
