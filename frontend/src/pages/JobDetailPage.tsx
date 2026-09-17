import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import type { Job } from '../types';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  async function handleApply() {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplying(true);
    setError('');
    setMessage('');
    try {
      await api.post('/applications', { jobId: Number(id) });
      setMessage('Lamaran berhasil dikirim!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal melamar');
    } finally {
      setApplying(false);
    }
  }

  if (!job) return <p className="text-center mt-10">Memuat...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-gray-600 mt-1">{job.company.name} &middot; {job.location}</p>
        <div className="flex gap-2 mt-3 text-sm">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{job.jobType}</span>
          {job.salary && <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Rp {job.salary.toLocaleString('id-ID')}</span>}
        </div>
        <p className="mt-4 whitespace-pre-line">{job.description}</p>

        {user?.role !== 'COMPANY' && (
          <button onClick={handleApply} disabled={applying} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {applying ? 'Mengirim...' : 'Apply Job'}
          </button>
        )}
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}