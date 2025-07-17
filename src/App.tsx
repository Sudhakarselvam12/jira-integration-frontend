import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashbord";
import Projects from "./pages/Projects.tsx";
import Issues from "./pages/Issues.tsx";
import Audit from "./pages/AuditTrail.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="issues" element={<Issues />} />
          <Route path="audit" element={<Audit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
