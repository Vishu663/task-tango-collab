
import React from "react";
import { Search, X } from "lucide-react";
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
import { TaskFilter } from "../../contexts/TaskContext";
import { priorityOptions, statusOptions } from "../../lib/mockData";
import { Status, Priority } from "../../types";

interface TaskFiltersProps {
  filter: TaskFilter;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleFilterChange: (key: keyof TaskFilter, value: string | boolean | undefined) => void;
  handleSearch: (e: React.FormEvent) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  searchInput,
  setSearchInput,
  handleFilterChange,
  handleSearch,
  clearFilters,
  hasActiveFilters,
}) => {
  return (
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
  );
};

export default TaskFilters;
