import "../styles/table.scss";

type Column<T> = {
  header: string;
  accessor: keyof T;
  width?: string;
  maxWidth?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  maxHeight?: string | number;
};

function Table<T>({ columns, data, maxHeight = "500px" }: TableProps<T>) {
  return (
    <div className="table-container" style={{ maxHeight }}>
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                style={{
                  width: col.width || "auto",
                  maxWidth: col.maxWidth || "none"
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="no-data">
                No Data Available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    style={{
                      maxWidth: col.maxWidth || "200px",
                      whiteSpace: "normal",
                      wordBreak: "break-word"
                    }}
                  >
                    <div className="cell-wrapper">
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
