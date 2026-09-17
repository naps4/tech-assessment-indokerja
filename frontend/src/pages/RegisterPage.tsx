import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'JOB_SEEKER' | 'COMPANY'>('JOB_SEEKER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      login(res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Register gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" required />
        <select value={role} onChange={(e) => setRole(e.target.value as 'JOB_SEEKER' | 'COMPANY')} className="border rounded px-3 py-2">
          <option value="JOB_SEEKER">Job Seeker</option>
          <option value="COMPANY">Company</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">Sudah punya akun? <Link to="/login" className="text-blue-600">Login</Link></p>
    </div>
  );
}