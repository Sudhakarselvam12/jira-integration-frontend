type Column<T> = {
  header: string;
  accessor: keyof T;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

function Table<T>({ columns, data }: TableProps<T>) {
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
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.accessor)} className="p-2 border">
                  {String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
