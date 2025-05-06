
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TaskEmptyStateProps {
  hasActiveFilters: boolean;
}

const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({ hasActiveFilters }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium">No tasks found</h3>
      <p className="text-muted-foreground mt-1">
        {hasActiveFilters
          ? "Try changing or clearing your filters"
          : "Create your first task to get started"}
      </p>
      {!hasActiveFilters && (
        <Button onClick={() => navigate("/tasks/new")} className="mt-4">
          Create Task
        </Button>
      )}
    </div>
  );
};

export default TaskEmptyState;
