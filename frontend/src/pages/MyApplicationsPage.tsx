import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Application } from '../types';

const statusColor: Record<string, string> = {
  APPLIED: 'bg-gray-100 text-gray-700',
  REVIEWING: 'bg-yellow-100 text-yellow-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
  ACCEPTED: 'bg-green-100 text-green-700',
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/me').then((res) => {
      setApplications(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Lamaran Saya</h1>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{app.job?.title}</h2>
              <p className="text-gray-600 text-sm">{app.job?.company.name} &middot; {app.job?.location}</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor[app.status]}`}>{app.status}</span>
          </div>
        ))}
        {applications.length === 0 && <p className="text-gray-500">Belum ada lamaran.</p>}
      </div>
    </div>
  );
}