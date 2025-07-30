import axios from "axios";
import type { FetchIssuesParams, IssueData, IssueFilter, IssueFilterOptions } from "./issues.types";
import { useQuery } from "@tanstack/react-query";

export const fetchIssues = async (filters: IssueFilter, { page, limit }: FetchIssuesParams): Promise<IssueData> => {
  const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/issues`, {
    params: {
      jiraId: filters.jiraId,
      title: filters.title,
      type: filters.type,
      priority: filters.priority,
      status: filters.status,
      project: filters.project,
      reporter: filters.reporter,
      page,
      limit,
    },
  });
  return res.data;
};

export const useIssuesQuery = (filters: IssueFilter,page: number, limit: number) => {
  return useQuery<IssueData>({
    queryKey: ['issues', filters, page, limit],
    queryFn: () => fetchIssues(filters, { page, limit }),
  });
};

export const useGetIssueFilterQuery = () => {
  return useQuery<IssueFilterOptions>({
    queryKey: ['issueFilter'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/issues/filteroptions`);
      return res.data;
    },
  });
}
