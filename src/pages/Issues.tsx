import { useEffect, useState } from "react";
import Table from "./../common/Table";
import axios from "axios";

type Issue = {
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

const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_URL}/api/issues`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
      .then((res) => {
      return res.data;
      })
      .then((data) => setIssues(data));
  }, []);

  const columns: { header: string; accessor: keyof Issue }[] = [
    { header: "Jira ID", accessor: "jiraId" },
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    { header: "Type", accessor: "type" },
    { header: "Priority", accessor: "priority" },
    { header: "Assignee", accessor: "assignee" },
    { header: "Reporter", accessor: "reporter" },
    { header: "Project", accessor: "project" },
    { header: "Estimated Time", accessor: "estimatedTime" },
    { header: "Spent Time", accessor: "spentTime" },
    { header: "Status", accessor: "status" },
    { header: "Created At", accessor: "createdAt" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Issues</h2>
      <Table columns={columns} data={issues} />
    </div>
  );
};

export default Issues;
