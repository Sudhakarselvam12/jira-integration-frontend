export type ProjectData = {
  data: Project[];
  count: number;
  lastSyncedAt: string;
}

export type Project = {
  jiraId: string;
  name: string;
  jiraProjectKey: string;
  lead: string;
  status: string;
  createdAt: string;
};

export type FetchProjectsParams = {
  page: number;
  limit: number;
};