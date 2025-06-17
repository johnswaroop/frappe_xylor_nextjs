import { useQuery } from "@tanstack/react-query";
import { mockProjects } from "@/lib/mock-data";

// Simulate an API call
const fetchProjects = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockProjects;
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook for fetching a single project
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProjects.find((project) => project.id === projectId);
    },
    enabled: !!projectId, // Only run if projectId is provided
    staleTime: 5 * 60 * 1000,
  });
};
