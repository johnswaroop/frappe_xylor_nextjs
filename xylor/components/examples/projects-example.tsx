"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import {
  useCreateProject,
  useUpdateProject,
} from "@/hooks/use-project-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, RefreshCw } from "lucide-react";

export default function ProjectsExample() {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCustomer, setNewProjectCustomer] = useState("");

  // Query hook
  const {
    data: projects,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProjects();

  // Mutation hooks
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !newProjectCustomer.trim()) return;

    try {
      await createProjectMutation.mutateAsync({
        name: newProjectName,
        customer: newProjectCustomer,
        expected_end_date: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
      });
      setNewProjectName("");
      setNewProjectCustomer("");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleUpdateProjectStatus = async (
    projectId: string,
    newStatus: string
  ) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error loading projects: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-2" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects (React Query Example)</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Create Project Form */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Create New Project</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Customer"
            value={newProjectCustomer}
            onChange={(e) => setNewProjectCustomer(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleCreateProject}
            disabled={
              createProjectMutation.isPending ||
              !newProjectName.trim() ||
              !newProjectCustomer.trim()
            }
          >
            {createProjectMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects?.map((project) => (
          <div key={project.id} className="p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600">
                  Customer: {project.customer}
                </p>
                <p className="text-sm text-gray-600">
                  Progress: {project.percent_complete}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{project.status}</Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUpdateProjectStatus(project.id, "Working")
                    }
                    disabled={updateProjectMutation.isPending}
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUpdateProjectStatus(project.id, "Completed")
                    }
                    disabled={updateProjectMutation.isPending}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status indicators */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          Query Status:{" "}
          {isLoading ? "Loading" : isFetching ? "Fetching" : "Idle"}
        </p>
        <p>
          Create Mutation:{" "}
          {createProjectMutation.isPending ? "Creating..." : "Ready"}
        </p>
        <p>
          Update Mutation:{" "}
          {updateProjectMutation.isPending ? "Updating..." : "Ready"}
        </p>
      </div>
    </div>
  );
}
