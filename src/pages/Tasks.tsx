
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTask, TaskFilter } from "../contexts/TaskContext";
import AppLayout from "../components/layout/AppLayout";
import TasksHeader from "../components/tasks/TasksHeader";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import { Status, Priority } from "../types";

const Tasks = () => {
  const { getTasksByFilter } = useTask();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<TaskFilter>({
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") as Status || undefined,
    priority: searchParams.get("priority") as Priority || undefined,
    assignedToMe: searchParams.get("assignedToMe") === "true" || undefined,
    createdByMe: searchParams.get("createdByMe") === "true" || undefined,
    overdue: searchParams.get("overdue") === "true" || undefined,
  });
  const [searchInput, setSearchInput] = useState(filter.search || "");

  // Apply filters from URL on mount and when searchParams change
  useEffect(() => {
    setFilter({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") as Status || undefined,
      priority: searchParams.get("priority") as Priority || undefined,
      assignedToMe: searchParams.get("assignedToMe") === "true" || undefined,
      createdByMe: searchParams.get("createdByMe") === "true" || undefined,
      overdue: searchParams.get("overdue") === "true" || undefined,
    });
    setSearchInput(searchParams.get("search") || "");
  }, [searchParams]);

  // Get tasks based on current filters
  const filteredTasks = getTasksByFilter(filter);

  // Update URL with filters
  const updateSearchParams = (newFilter: TaskFilter) => {
    const params = new URLSearchParams();
    if (newFilter.search) params.set("search", newFilter.search);
    if (newFilter.status) params.set("status", newFilter.status);
    if (newFilter.priority) params.set("priority", newFilter.priority);
    if (newFilter.assignedToMe) params.set("assignedToMe", "true");
    if (newFilter.createdByMe) params.set("createdByMe", "true");
    if (newFilter.overdue) params.set("overdue", "true");
    setSearchParams(params);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof TaskFilter, value: string | boolean | undefined) => {
    const newFilter = { ...filter, [key]: value };
    updateSearchParams(newFilter);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("search", searchInput);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filter).some((val) => val !== undefined);

  return (
    <AppLayout>
      <div className="space-y-6">
        <TasksHeader />
        <TaskFilters 
          filter={filter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleFilterChange={handleFilterChange}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <TaskList 
          tasks={filteredTasks}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </AppLayout>
  );
};

export default Tasks;
