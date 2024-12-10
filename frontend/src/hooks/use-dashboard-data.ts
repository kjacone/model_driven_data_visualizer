import useSWR from "swr";

// Define types for the dashboard data
interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  runtime: string;
  version: string;
  lastDeployed?: string;
  actions: Array<{
    id: string;
    description: string;
    createdAt: string;
  }>;
  history: Array<{
    id: string;
    event: string;
    createdAt: string;
    metadata?: Record<string, any>;
  }>;
}

export interface User {
  projects: Project[];
  // Add other user fields as needed
}

export interface DashboardData {
  user: User;
}

// Global fetcher function
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Custom hook for dashboard data
export function useDashboardData(refreshInterval: number = 30000) {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    user: data,
    isError: error != null,
  };
}
