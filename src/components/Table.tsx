import { useState } from "react";
import "../styles/table.scss";

type Column<T> = {
  header: string;
  accessor: keyof T;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  maxHeight?: string | number;
};

function Table<T>({ columns, data, maxHeight = "500px" }: TableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<{[key: number]: boolean}>({});

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
                {columns.map((col) => {
                  const expanded = expandedRows[idx];
                  return (
                    <td
                      key={String(col.accessor)}
                      onClick={() => toggleRow(idx)}
                      style={{
                        maxWidth: col.maxWidth || "200px",
                        maxHeight: expanded ? "none" : col.maxHeight || "60px",
                        overflow: "hidden"
                      }}
                      className={expanded ? "expanded" : "collapsed"}
                    >
                      <div className="cell-wrapper">
                        {String(row[col.accessor])}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
