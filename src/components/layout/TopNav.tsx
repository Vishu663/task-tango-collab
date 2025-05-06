
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { useTask } from "../../contexts/TaskContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const TopNav = () => {
  const { isAuthenticated } = useAuth();
  const { notifications, markNotificationAsRead, clearAllNotifications } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-border shadow-sm py-2 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="max-w-sm w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center"
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2 border-b">
                <h2 className="font-medium">Notifications</h2>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                    Clear all
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`cursor-pointer p-3 ${
                        !notification.read ? "bg-accent/40" : ""
                      }`}
                      onClick={() => {
                        markNotificationAsRead(notification.id);
                        navigate(`/tasks/${notification.taskId}`);
                      }}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm font-medium">{notification.message}</div>
                          {!notification.read && (
                            <Badge variant="default" className="text-[10px] py-0 px-1.5">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(notification.timestamp), "MMM d, h:mm a")}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => navigate("/tasks/new")} className="hidden sm:flex">
            New Task
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
