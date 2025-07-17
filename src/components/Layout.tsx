import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Jira Integration</h1>
      </header>

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-4">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-primary">Dashboard</Link>
            <Link to="/projects" className="text-gray-700 hover:text-primary">Projects</Link>
            <Link to="/issues" className="text-gray-700 hover:text-primary">Issues</Link>
            <Link to="/audit" className="text-gray-700 hover:text-primary">Audit</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-3 shadow-inner">
        <span className="text-sm text-gray-500">© 2025 Jira Integration Dashboard</span>
      </footer>
    </div>
  );
};

export default Layout;
