
import React from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";
import { Task } from "../../types";

interface TaskListProps {
  tasks: Task[];
  hasActiveFilters: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, hasActiveFilters }) => {
  const navigate = useNavigate();
  
  if (tasks.length === 0) {
    return <TaskEmptyState hasActiveFilters={hasActiveFilters} />;
  }
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => navigate(`/tasks/${task.id}`)}
        />
      ))}
    </div>
  );
};

export default TaskList;
