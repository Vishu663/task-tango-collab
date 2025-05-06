
import { 
  Home, 
  ListCheck, 
  UserPlus, 
  Bell, 
  LogIn, 
  Calendar, 
  Filter,
  LogOut 
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTask } from "../../contexts/TaskContext";
import { useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AppSidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications } = useTask();
  const navigate = useNavigate();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // If not authenticated, show minimal sidebar
  if (!isAuthenticated || !user) {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center px-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-white">
              <ListCheck />
              <span>TaskTango</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild onClick={() => navigate("/login")}>
                    <div className="flex items-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      <span>Login</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild onClick={() => navigate("/register")}>
                    <div className="flex items-center">
                      <UserPlus className="mr-2 h-5 w-5" />
                      <span>Register</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-lg text-white">
            <ListCheck />
            <span>TaskTango</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/dashboard")}>
                  <div className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/tasks")}>
                  <div className="flex items-center">
                    <ListCheck className="mr-2 h-5 w-5" />
                    <span>Tasks</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/calendar")}>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>Calendar</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/tasks?assignedToMe=true")}>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    <span>Assigned to me</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/tasks?createdByMe=true")}>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    <span>Created by me</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => navigate("/tasks?overdue=true")}>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    <span>Overdue</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-sidebar-accent-foreground">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-1 rounded-full hover:bg-sidebar-accent transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
