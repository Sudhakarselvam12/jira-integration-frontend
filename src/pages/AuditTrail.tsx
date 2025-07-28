import Table from "./../common/Table";
import type { AuditTrail } from "../queries/audit-trail/audit-trail.types";
import { useState } from "react";
import { formatDate } from "../common/helper";
import { useAuditTrailQuery } from "../queries/audit-trail/audit-trail";

const AuditTrail = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useAuditTrailQuery(page, limit);

  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const columns: { header: string; accessor: keyof AuditTrail }[] = [
    { header: "Entity Type", accessor: "entityType" },
    { header: "Entity ID", accessor: "entityId" },
    { header: "Changed Field", accessor: "changedField" },
    { header: "Old Value", accessor: "oldValue" },
    { header: "New Value", accessor: "newValue" },
    { header: "Changed At", accessor: "changedAt" },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load issues.</p>;

  const formattedData = data?.data.map((auditData) => ({
    ...auditData,
    changedAt: formatDate(auditData.changedAt),
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Audit Trail</h2>
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

export default AuditTrail;
