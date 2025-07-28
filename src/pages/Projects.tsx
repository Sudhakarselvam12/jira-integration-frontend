import Table from "./../common/Table";
import { useState } from "react";
import { useProjectsQuery } from "../queries/projects/projects";
import type { Project } from "../queries/projects/projects.types";
import { formatDate } from "../common/helper";

const Projects = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useProjectsQuery(page, limit);

  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const columns: { header: string; accessor: keyof Project }[] = [
    { header: "Jira ID", accessor: "jiraId" },
    { header: "Name", accessor: "name" },
    { header: "Jira Project Key", accessor: "jiraProjectKey" },
    { header: "Lead", accessor: "lead" },
    { header: "Status", accessor: "status" },
    { header: "Created At", accessor: "createdAt" },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load projects.</p>;

    const formattedData = data?.data.map((project) => ({
      ...project,
      createdAt: formatDate(project.createdAt),
    }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <Table columns={columns} data={formattedData || []} />
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

export default Projects;
