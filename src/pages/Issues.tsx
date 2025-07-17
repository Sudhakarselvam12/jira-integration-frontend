const Issues = () => {
  const issues = [
    { id: 1, title: "Issue #1", status: "Open", project: "Project Alpha" },
    { id: 2, title: "Issue #2", status: "In Progress", project: "Project Beta" },
    { id: 3, title: "Issue #3", status: "Closed", project: "Project Gamma" },
  ];

  return (
    <div className="h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Issues</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800">{issue.title}</h2>
            <p className="text-gray-600 mt-2">Status: {issue.status}</p>
            <p className="text-gray-600 mt-2">Project: {issue.project}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Issues;
