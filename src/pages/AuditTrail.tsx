import Table from './../common/Table';
import type { AuditFilter, AuditTrailType } from '../queries/audit-trail/audit-trail.types';
import { useState } from 'react';
import { formatDate } from '../common/helper';
import { useAuditTrailQuery, useGetAuditFilterQuery } from '../queries/audit-trail/audit-trail';
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

  const { data, isLoading, isError } = useAuditTrailQuery(debouncedFilters, page, limit, { enabled: isValidDateRange });
  const { data: filterOptions } = useGetAuditFilterQuery();

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

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Audit Trail</h2>
      <div className='flex gap-4 mb-4'>
        {filterOptions && (
          Object.entries(filterOptions).map(([key, values]) => (
            <div key={key} className='flex flex-col'>
              <label className='text-sm font-bold mb-1 capitalize'>Filter by {key}</label>
              <select
                value={filters[key as keyof AuditFilter]}
                onChange={e => handleFilterChange(key as keyof AuditFilter, e.target.value)}
                className='border rounded p-1 text-sm'
              >
                <option value=''>All {key}</option>
                {(values as string[]).map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>

      <div className='flex gap-4 mb-4'>
        <div className='flex flex-col'>
          <label className='text-sm font-bold mb-1'>Start Date</label>
          <DatePicker
            selected={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(date) => handleFilterChange('startDate', date?.toISOString().split('T')[0] ?? '')}
            maxDate={filters.endDate ? new Date(filters.endDate) : new Date()}
            dateFormat="yyyy-MM-dd"
            placeholderText="Start Date"
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-sm font-bold mb-1'>End Date</label>
          <DatePicker
            selected={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(date) => handleFilterChange('endDate', date?.toISOString().split('T')[0] ?? '')}
            minDate={filters.startDate ? new Date(filters.startDate) : undefined}
            maxDate={new Date()}
            disabled={!filters.startDate}
            placeholderText="End Date"
          />
        </div>
      </div>
      {!isValidDateRange && (
        <p className="text-red-500 text-sm mb-2">
          Please select both start date and end date
        </p>
      )}

      <Table columns={columns} data={formattedData ?? []} />

      <div className='mt-4 flex justify-end items-center gap-4 text-sm'>
        <div className='flex items-center gap-2'>
          <label htmlFor='limit' className='text-gray-700'>Items per page:</label>
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
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className='px-2 py-1 border rounded disabled:opacity-50'
          >Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className='px-2 py-1 border rounded disabled:opacity-50'
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
