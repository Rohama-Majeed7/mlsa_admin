import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="MLSA" />
          <span>MLSA Admin</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/events" className={({ isActive }) => (isActive ? 'active' : '')}>
            Events
          </NavLink>
          <NavLink to="/admin/team" className={({ isActive }) => (isActive ? 'active' : '')}>
            Team Members
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-email">{admin?.email}</p>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm sidebar-logout">
            Logout
          </button>
        </div>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
