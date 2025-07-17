const Projects = () => {
  const projects = [
    { id: 1, name: "Project Alpha", issues: 10 },
    { id: 2, name: "Project Beta", issues: 5 },
    { id: 3, name: "Project Gamma", issues: 8 },
  ];

  return (
    <div className="h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
            <p className="text-gray-600 mt-2">Issues: {project.issues}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
