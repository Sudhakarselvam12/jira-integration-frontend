import { useEffect, useState } from "react";
import Table from "./../common/Table";
import axios from "axios";

type Issue = {
  id: number;
  title: string;
  status: string;
  createdAt: string;
};

const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACK_URL}/api/issues`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
      .then((res) => {
      return res.data;
      })
      .then((data) => setIssues(data));
  }, []);

  const columns: { header: string; accessor: keyof Issue }[] = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Status", accessor: "status" },
    { header: "Created At", accessor: "createdAt" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Issues</h2>
      <Table columns={columns} data={issues} />
    </div>
  );
};

export default Issues;
