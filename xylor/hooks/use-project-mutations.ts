import { useMutation, useQueryClient } from "@tanstack/react-query";

// Types for the mutations
interface CreateProjectData {
  name: string;
  customer: string;
  expected_end_date: string;
}

interface UpdateProjectData {
  id: string;
  name?: string;
  status?: string;
  percent_complete?: number;
}

// Simulate API calls
const createProject = async (data: CreateProjectData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id: `proj-${Date.now()}`,
    ...data,
    status: "Open",
    percent_complete: 0,
    creation: new Date().toISOString(),
  };
};

const updateProject = async (data: UpdateProjectData) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return data;
};

const deleteProject = async (projectId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { id: projectId };
};

// Mutation hooks
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: (data) => {
      // Update the specific project in cache
      queryClient.setQueryData(["project", data.id], data);
      // Invalidate projects list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (data) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["project", data.id] });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });
};
