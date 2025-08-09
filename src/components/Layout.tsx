import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Menu } from "lucide-react";
import "../styles/layout.scss";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="layout">
      <header className="layout__header">
        {!isSidebarOpen && (
          <button
            className="layout__menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
        )}
        <h1 className="layout__title">Jira Integration</h1>
      </header>

      <div className="layout__body">
        <aside className={`layout__sidebar ${isSidebarOpen ? "open" : ""}`}>
          <nav className="layout__nav">
            <Link to="/" className="layout__nav-link">Dashboard</Link>
            <Link to="/projects" className="layout__nav-link">Projects</Link>
            <Link to="/issues" className="layout__nav-link">Issues</Link>
            <Link to="/audit" className="layout__nav-link">Audit</Link>
          </nav>
          {isSidebarOpen && (
            <button
              className="layout__close-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </aside>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>

      <footer className="layout__footer">
        <span>© 2025 Jira Integration Dashboard</span>
      </footer>
    </div>
  );
};

export default Layout;
