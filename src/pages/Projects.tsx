import Table from "./../common/Table";
import { useState } from "react";
import { useProjectsQuery, useProjectsSync } from "../queries/projects/projects";
import type { Project } from "../queries/projects/projects.types";
import { formatDate } from "../common/helper";
import axios from "axios";

const Projects = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, refetch, isLoading, isError } = useProjectsQuery(page, limit);

  const onSyncSuccess = () => {
    setStatusMessage('Sync completed successfully.');
    setTimeout(() => setStatusMessage(null), 5000);
    refetch();
  }
  const onSyncError = () => {
    setStatusMessage('Failed to sync issues.');
    setTimeout(() => setStatusMessage(null), 5000);
  }

  const handleExport = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/projects/export`, {
        responseType: 'blob',
      });
      if (response.status !== 200) {
        throw new Error('Failed to export projects');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `projects_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const {
    mutate: syncProjectsFromJira,
    isPending: isSyncPending,
  } = useProjectsSync(onSyncSuccess, onSyncError);

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
      {statusMessage && (
        <div className='bg-green-100 text-green-800 p-2 rounded mb-4'>
          {statusMessage}
        </div>
      )}
      <div>
        <button
          onClick={() => syncProjectsFromJira()}
          disabled={isSyncPending}
          className='bg-blue-500 px-4 py-2 rounded mr-2'
        >
          {isSyncPending ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
      <button
        onClick={handleExport}
        className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'
      >
        Export to Excel
      </button>
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
      {data?.lastSyncedAt && (
        <div className='mt-4 text-sm text-gray-600'>
          Last Sync At: {data?.lastSyncedAt ? formatDate(data.lastSyncedAt) : 'N/A'}
        </div>)
      }
    </div>
  );
};

export default Projects;
