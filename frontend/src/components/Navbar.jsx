import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">GovInterop Portal</Link>
        <div>
          {token ? (
            <div className="flex gap-4">
              {role === 'citizen' && <Link to="/citizen/dashboard" className="hover:underline">Dashboard</Link>}
              {role === 'official' && <Link to="/official/dashboard" className="hover:underline">Dashboard</Link>}
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
