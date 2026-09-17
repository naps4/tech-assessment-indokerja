import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow px-4 py-3 flex flex-wrap items-center justify-between gap-2">
      <Link to="/" className="font-bold text-lg text-blue-600">IndoKerja</Link>
      <div className="flex items-center gap-4 text-sm">
        {user?.role === 'JOB_SEEKER' && (
          <>
            <Link to="/" className="hover:underline">Lowongan</Link>
            <Link to="/my-applications" className="hover:underline">Lamaran Saya</Link>
          </>
        )}
        {user?.role === 'COMPANY' && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
        {user ? (
          <>
            <span className="text-gray-500 hidden sm:inline">{user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}