import Table from '../components/Table';
import type {
  AuditFilter,
  AuditTrailType,
} from '../queries/audit-trail/audit-trail.types';
import { useState } from 'react';
import { formatDate } from '../common/helper';
import {
  exportAuditData,
  useAuditTrailQuery,
  useGetAuditFilterQuery,
} from '../queries/audit-trail/audit-trail';
import { useDebounce } from 'use-debounce';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const auditFilter = {
  entityType: '',
  changedField: '',
  startDate: '',
  endDate: '',
};

const AuditTrail = () => {
  const [filters, setFilters] = useState<AuditFilter>(auditFilter);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedFilters] = useDebounce(filters, 400);

  const isValidDateRange =
    (debouncedFilters.startDate === '' && debouncedFilters.endDate === '') ||
    (debouncedFilters.startDate !== '' && debouncedFilters.endDate !== '');

  const { data, isLoading, isError } = useAuditTrailQuery(
    debouncedFilters,
    page,
    limit,
    { enabled: isValidDateRange }
  );
  const { data: filterOptions } = useGetAuditFilterQuery();

  const handleExport = async () => {
    try {
      const response = await exportAuditData();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `audit-trail_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const columns: { header: string; accessor: keyof AuditTrailType }[] = [
    { header: 'Entity Type', accessor: 'entityType' },
    { header: 'Entity ID', accessor: 'entityId' },
    { header: 'Changed Field', accessor: 'changedField' },
    { header: 'Old Value', accessor: 'oldValue' },
    { header: 'New Value', accessor: 'newValue' },
    { header: 'Changed At', accessor: 'changedAt' },
  ];

  const labelName = (key: string) => {
    const labels: Record<string, string> = {
      entityType: 'Entity Type',
      changedField: 'Changed Field',
    };
    return labels[key] || key;
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load issues.</p>;

  const formattedData = data?.data?.map((auditData) => ({
    ...auditData,
    changedAt: formatDate(auditData.changedAt),
  }));

  const handleFilterChange = (key: keyof AuditFilter, value: string) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setPage(1);
    setFilters(auditFilter);
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 shadow'>
        Audit Trail
      </h2>
      <div className='mb-4 shadow-sm p-4 rounded-lg'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4'>
          {filterOptions &&
            Object.entries(filterOptions).map(([key, values]) => (
              <div
                key={key}
                className='flex flex-col bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition'
              >
                <label className='text-sm font-bold mb-1 capitalize'>
                  Filter by {labelName(key)}
                </label>
                <select
                  value={filters[key as keyof AuditFilter]}
                  onChange={(e) =>
                    handleFilterChange(key as keyof AuditFilter, e.target.value)
                  }
                  className='border rounded p-1 text-sm'
                >
                  <option value=''>All {labelName(key)}</option>
                  {(values as string[]).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          <div className='flex flex-col shadow-sm p-4 rounded-lg'>
            <label className='text-sm font-bold mb-1'>Start Date</label>
            <DatePicker
              selected={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(date) =>
                handleFilterChange(
                  'startDate',
                  date?.toISOString().split('T')[0] ?? ''
                )
              }
              maxDate={filters.endDate ? new Date(filters.endDate) : new Date()}
              dateFormat='yyyy-MM-dd'
              placeholderText='Start Date'
            />
          </div>
          <div className='flex flex-col shadow-sm p-4 rounded-lg'>
            <label className='text-sm font-bold mb-1'>End Date</label>
            <DatePicker
              selected={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(date) =>
                handleFilterChange(
                  'endDate',
                  date?.toISOString().split('T')[0] ?? ''
                )
              }
              minDate={
                filters.startDate ? new Date(filters.startDate) : undefined
              }
              maxDate={new Date()}
              disabled={!filters.startDate}
              placeholderText='End Date'
            />
          </div>
        </div>
        {!isValidDateRange && (
          <p className='text-red-500 text-sm mb-2'>
            Please select both start date and end date
          </p>
        )}
        <div className='flex justify-end'>
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
    </div>
  );
};

export default AuditTrail;
