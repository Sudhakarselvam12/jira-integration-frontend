import Table from './../common/Table';
import type { Issue, IssueFilter } from '../queries/issues/issues.types';
import { useGetIssueFilterQuery, useIssuesQuery, useIssueSync } from '../queries/issues/issues';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { formatDate } from '../common/helper';
import axios from 'axios';

const issueFilter: IssueFilter = {
  jiraId: '',
  title: '',
  type: '',
  priority: '',
  status: '',
  project: '',
  reporter: '',
};

const Issues = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<IssueFilter>(issueFilter);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedFilters] = useDebounce(filters, 400);

  const { data, refetch, isLoading, isError } = useIssuesQuery(debouncedFilters, page, limit);
  const { data: filterOptions } = useGetIssueFilterQuery();

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
      const response = await axios.get(`${import.meta.env.VITE_BACK_URL}/api/issues/export`, {
        responseType: 'blob',
      });
      if (response.status !== 200) {
        throw new Error('Failed to export issues');
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issues_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const {
    mutate: syncIssuesFromJira,
    isPending: isSyncPending,
  } = useIssueSync(onSyncSuccess, onSyncError);

  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const columns: { header: string; accessor: keyof Issue }[] = [
    { header: 'Jira ID', accessor: 'jiraId' },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Type', accessor: 'type' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Assignee', accessor: 'assignee' },
    { header: 'Reporter', accessor: 'reporter' },
    { header: 'Project', accessor: 'project' },
    { header: 'Estimated Time', accessor: 'estimatedTime' },
    { header: 'Spent Time', accessor: 'spentTime' },
    { header: 'Status', accessor: 'status' },
    { header: 'Created At', accessor: 'createdAt' },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load issues.</p>;

  const formattedData = data?.data?.map((issue) => ({
    ...issue,
    createdAt: formatDate(issue.createdAt),
    updatedAt: formatDate(issue.updatedAt),
  }));

  const handleFilterChange = (key: keyof IssueFilter, value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setPage(1);
    setFilters(issueFilter);
  };

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Issues</h2>
      {statusMessage && (
        <div className='bg-green-100 text-green-800 p-2 rounded mb-4'>
          {statusMessage}
        </div>
      )}

      <div>
        <input
          type='text'
          placeholder='Search by Jira ID'
          value={filters.jiraId}
          onChange={(e) => handleFilterChange('jiraId', e.target.value)}
          className='border rounded p-1 mr-2'
        />
        <input
          type='text'
          placeholder='Search by Title'
          value={filters.title}
          onChange={(e) => handleFilterChange('title', e.target.value)}
          className='border rounded p-1'
        />
        {filterOptions && (
          <div>
            {Object.entries(filterOptions).map(([key, values]) => (
              <div key={key} className='flex flex-col mr-4'>
                <label className='text-sm font-bold mb-1 capitalize'>
                  Filter by {key}
                </label>
                <select
                  key={key}
                  value={filters[key as keyof IssueFilter]}
                  onChange={e => handleFilterChange(key as keyof IssueFilter, e.target.value)}
                  className='border rounded p-1 text-sm'
                >
                  <option value=''>All {key}</option>
                  {(values as string[]).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => handleReset()}
          className='mt-2 mb-3 bg-blue-500 px-4 py-2 rounded mt-2'
        >
          Reset Filters
        </button>
      </div>
      <div>
        <button
          onClick={() => syncIssuesFromJira()}
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
      <Table columns={columns} data={formattedData ?? []} />
      <div className='mt-4 flex justify-end items-center gap-4 text-sm'>
        <div className='flex items-center gap-2'>
          <label htmlFor='limit' className='text-gray-700'>
            Items per page:
          </label>
          <select
            id='limit'
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value));
            }}
            className='border px-2 py-1 rounded text-sm'
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className='px-2 py-1 border rounded disabled:opacity-50'
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className='px-2 py-1 border rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
      {data?.lastSyncedAt && (
        <div className='mt-4 text-sm text-gray-600'>
          Last Sync At: {data?.lastSyncedAt ? formatDate(data.lastSyncedAt) : 'N/A'}
        </div>
      )}
    </div>
  );
};

export default Issues;
