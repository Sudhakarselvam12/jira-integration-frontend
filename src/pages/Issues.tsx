import Table from '../components/Table';
import type { Issue, IssueFilter } from '../queries/issues/issues.types';
import { exportIssuesData, useGetIssueFilterQuery, useIssuesQuery, useIssueSync } from '../queries/issues/issues';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { formatDate } from '../common/helper';

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
      const response = await exportIssuesData();

      const url = window.URL.createObjectURL(new Blob([response]));
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

  const columns: { header: string; accessor: keyof Issue, width: string }[] = [
    { header: 'Jira ID', accessor: 'jiraId', width: '120px' },
    { header: 'Title', accessor: 'title', width: '200px' },
    { header: 'Description', accessor: 'description', width: '350px' },
    { header: 'Type', accessor: 'type', width: '100px' },
    { header: 'Priority', accessor: 'priority', width: '100px' },
    { header: 'Assignee', accessor: 'assignee', width: '150px' },
    { header: 'Reporter', accessor: 'reporter', width: '150px' },
    { header: 'Project', accessor: 'project', width: '150px' },
    { header: 'Estimated Time', accessor: 'estimatedTime', width: '120px' },
    { header: 'Spent Time', accessor: 'spentTime', width: '120px' },
    { header: 'Status', accessor: 'status', width: '120px' },
    { header: 'Created At', accessor: 'createdAt', width: '150px' },
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
      <h2 className="text-2xl font-bold mb-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 shadow">
        Issues
      </h2>
      {statusMessage && (
        <div className='bg-green-100 text-green-800 p-2 rounded mb-4'>
          {statusMessage}
        </div>
      )}

      <div className='mb-4 shadow-sm p-4 rounded-lg'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
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
        </div>
          {filterOptions && (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
              {Object.entries(filterOptions).map(([key, values]) => (
                <div key={key} className='flex flex-col bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition'>
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
        <div className="flex justify-end">
          <button
            onClick={() => handleReset()}
            className='mt-2 mb-3 bg-blue-500 px-4 py-2 rounded shadow'
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div className='flex justify-end mb-4'>
        <button
          onClick={() => syncIssuesFromJira()}
          disabled={isSyncPending}
          className='bg-blue-500 px-4 py-2 rounded mr-2 shadow'
        >
          {isSyncPending ? 'Syncing...' : 'Sync Now'}
        </button>
        <button
          onClick={handleExport}
          className='bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 shadow'
        >
          Export to Excel
        </button>
      </div>
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
