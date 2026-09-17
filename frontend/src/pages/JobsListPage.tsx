import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import type { Job } from '../types';

export default function JobsListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs').then((res) => {
      setJobs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat lowongan...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Lowongan Pekerjaan</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`} className="bg-white p-4 rounded shadow hover:shadow-md transition">
            <h2 className="font-semibold text-lg">{job.title}</h2>
            <p className="text-gray-600">{job.company.name} &middot; {job.location}</p>
            <div className="flex gap-2 mt-2 text-sm">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{job.jobType}</span>
              {job.salary && <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Rp {job.salary.toLocaleString('id-ID')}</span>}
            </div>
          </Link>
        ))}
        {jobs.length === 0 && <p className="text-gray-500">Belum ada lowongan.</p>}
      </div>
    </div>
  );
}