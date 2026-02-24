import { Link, useNavigate } from "react-router-dom";

function DashboardLayout({ title, subtitle, role, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="page-shell">
      <div className="bg-orb bg-orb-left" />
      <div className="bg-orb bg-orb-right" />

      <div className="container dashboard-wrap">
        <header className="topbar glass">
          <div>
            <p className="eyebrow">Medical Appointment Management</p>
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>

          <div className="topbar-actions">
            <span className="role-pill">{role}</span>
            <Link to={role === "doctor" ? "/doctor" : "/patient"} className="ghost-link">
              Dashboard
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;