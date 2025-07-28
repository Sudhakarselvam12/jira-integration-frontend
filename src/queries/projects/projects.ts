import axios from "axios";
import type { FetchProjectsParams, ProjectData } from "./projects.types";
import { useQuery } from "@tanstack/react-query";

export const fetchProjects = async ({ page, limit }: FetchProjectsParams): Promise<ProjectData> => {
  const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/projects`, {
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const useProjectsQuery = (page: number, limit: number) => {
  return useQuery<ProjectData>({
    queryKey: ['projects', page, limit],
    queryFn: () => fetchProjects({ page, limit }),
  });
};
