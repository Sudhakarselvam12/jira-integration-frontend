import React from "react";
import { Card, CardContent } from "../components/ui/card";

const Dashboard = () => {
  const stats = [
    { label: "Projects", count: 5 },
    { label: "Issues", count: 120 },
    { label: "Audit Trails", count: 300 },
  ];

  return (
    <div className="h-screen bg-gray-100 p-8 display-flex">
      <h2 className="text-3xl font-bold mb-8">  Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl shadow-lg p-4">
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-700">
                {stat.label}
              </h2>
              <p className="text-4xl font-bold text-primary mt-4">
                {stat.count}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
