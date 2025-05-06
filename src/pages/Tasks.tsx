
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTask, TaskFilter } from "../contexts/TaskContext";
import AppLayout from "../components/layout/AppLayout";
import TaskCard from "../components/tasks/TaskCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Status, Priority } from "../types";
import { Search, Filter, X, PlusIcon } from "lucide-react";
import { priorityOptions, statusOptions } from "../lib/mockData";

const Tasks = () => {
  const { getTasksByFilter } = useTask();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <Button onClick={() => navigate("/tasks/new")} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 w-full"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </form>

            {/* Status Filter */}
            <Select
              value={filter.status || ""}
              onValueChange={(value) => handleFilterChange("status", value || undefined)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={filter.priority || ""}
              onValueChange={(value) => handleFilterChange("priority", value || undefined)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Button
                variant={filter.assignedToMe ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("assignedToMe", !filter.assignedToMe)}
              >
                Assigned to me
              </Button>
              <Button
                variant={filter.overdue ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("overdue", !filter.overdue)}
              >
                Overdue
              </Button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
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
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/tasks/${task.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Tasks;
