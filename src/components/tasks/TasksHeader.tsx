
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon, PanelLeftIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const TasksHeader: React.FC = () => {
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {state === "collapsed" && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
          >
            <PanelLeftIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>
      <Button onClick={() => navigate("/tasks/new")} className="gap-2">
        <PlusIcon className="h-4 w-4" />
        New Task
      </Button>
    </div>
  );
};

export default TasksHeader;
