import Table from "./../common/Table";
import type { Issue } from "../queries/issues/issues.types";
import { useIssuesQuery } from "../queries/issues/issues";
import { useState } from "react";
import { formatDate } from "../common/helper";

const Issues = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useIssuesQuery(page, limit);

  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load issues.</p>;

  const formattedData = data?.data.map((issue) => ({
    ...issue,
    createdAt: formatDate(issue.createdAt),
    updatedAt: formatDate(issue.updatedAt),
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Issues</h2>
      <Table columns={columns} data={formattedData ?? []} />
      <div className="mt-4 flex justify-end items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-gray-700">
            Items per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className="border px-2 py-1 rounded text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Issues;
