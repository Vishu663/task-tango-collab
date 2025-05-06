
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const TasksHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      <Button onClick={() => navigate("/tasks/new")} className="gap-2">
        <PlusIcon className="h-4 w-4" />
        New Task
      </Button>
    </div>
  );
};

export default TasksHeader;
