import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/mockApi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [role, setRole] = useState('citizen');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isRegistering) {
        res = await api.auth.register({ email, password, name, nationalId, role });
      } else {
        res = await api.auth.login(email, password);
      }
      
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.user.role);
      
      if (res.user.role === 'official') {
        navigate('/official/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      alert(err.message || 'Error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded" />
            <input type="text" placeholder="National ID (Aadhaar/SSN)" value={nationalId} onChange={e => setNationalId(e.target.value)} required className="w-full border p-2 rounded" />
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2 rounded">
              <option value="citizen">Citizen</option>
              <option value="official">Official</option>
            </select>
          </>
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border p-2 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} className="mt-4 text-blue-600 underline">
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>
    </div>
  );
}

export default Login;
