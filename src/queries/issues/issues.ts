import axios from "axios";
import type { FetchIssuesParams, IssueData } from "./issues.types";
import { useQuery } from "@tanstack/react-query";

export const fetchIssues = async ({ page, limit }: FetchIssuesParams): Promise<IssueData> => {
  const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/issues`, {
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const useIssuesQuery = (page: number, limit: number) => {
  return useQuery<IssueData>({
    queryKey: ['issues', page, limit],
    queryFn: () => fetchIssues({ page, limit }),
  });
};
