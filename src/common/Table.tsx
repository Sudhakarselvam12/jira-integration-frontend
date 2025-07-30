import { useState } from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

function Table<T>({ columns, data }: TableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="p-2 border text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {!data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-2 border text-center text-gray-500">
              No Data Available
              </td>
            </tr>
            ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.accessor)} className="p-2 border max-w-xs align-top cursor-pointer" onClick={() => toggleRow(idx)}>
                <div className={expandedRows.includes(idx) ? '' : 'line-clamp-3 overflow-hidden text-ellipsis'}>
                  {String(row[col.accessor])}
                </div>
                </td>
              ))}
              </tr>
            ))
            )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
