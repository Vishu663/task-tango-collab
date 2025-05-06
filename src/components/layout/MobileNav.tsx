
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ListCheck, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { label: "Tasks", path: "/tasks", icon: <ListCheck className="h-5 w-5" /> },
    { label: "Calendar", path: "/calendar", icon: <Calendar className="h-5 w-5" /> },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
