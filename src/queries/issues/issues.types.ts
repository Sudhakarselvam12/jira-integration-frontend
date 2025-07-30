export type IssueData = {
  data: Issue[];
  count: number;
}

export type Issue = {
  jiraId: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  assignee: string;
  reporter: string;
  project: string;
  estimatedTime: string;
  spentTime: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

export type FetchIssuesParams = {
  page: number;
  limit: number;
};

export type IssueFilterOptions = {
  type: string[];
  priority: string[];
  status: string[];
  project: string[];
  reporter: string[];
};

export type IssueFilter = {
  jiraId: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  project: string;
  reporter: string;
};