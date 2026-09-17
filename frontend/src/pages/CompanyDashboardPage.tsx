import { useEffect, useState, type FormEvent } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Job, Application, ApplicationStatus } from '../types';

const STATUS_OPTIONS: ApplicationStatus[] = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'];

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);

  async function loadJobs() {
    const res = await api.get('/jobs');
    setJobs(res.data.filter((job: Job) => job.companyId === user?.userId));
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleCreateJob(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      await api.post('/jobs', { title, description, location, salary: salary ? Number(salary) : undefined, jobType });
      setTitle(''); setDescription(''); setLocation(''); setSalary(''); setJobType('FULL_TIME');
      await loadJobs();
    } catch (err: any) {
      setFormError(err.response?.data?.message?.toString() || 'Gagal membuat lowongan');
    } finally {
      setCreating(false);
    }
  }

  async function viewApplicants(jobId: number) {
    setSelectedJobId(jobId);
    const res = await api.get(`/jobs/${jobId}/applications`);
    setApplicants(res.data);
  }

  async function updateStatus(applicationId: number, status: ApplicationStatus) {
    await api.patch(`/applications/${applicationId}/status`, { status });
    if (selectedJobId) await viewApplicants(selectedJobId);
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-xl font-bold mb-3">Buat Lowongan Baru</h1>
        <form onSubmit={handleCreateJob} className="bg-white p-4 rounded shadow flex flex-col gap-3">
          <input placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded px-3 py-2" required />
          <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2" required />
          <input placeholder="Lokasi" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded px-3 py-2" required />
          <input placeholder="Gaji (opsional)" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="border rounded px-3 py-2" />
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="border rounded px-3 py-2">
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <button type="submit" disabled={creating} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {creating ? 'Membuat...' : 'Buat Lowongan'}
          </button>
        </form>

        <h2 className="text-lg font-bold mt-6 mb-2">Lowongan Saya</h2>
        <div className="grid gap-2">
          {jobs.map((job) => (
            <button key={job.id} onClick={() => viewApplicants(job.id)} className={`text-left p-3 rounded shadow bg-white hover:bg-gray-50 ${selectedJobId === job.id ? 'ring-2 ring-blue-500' : ''}`}>
              {job.title}
            </button>
          ))}
          {jobs.length === 0 && <p className="text-gray-500 text-sm">Belum ada lowongan.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Kandidat</h2>
        {!selectedJobId && <p className="text-gray-500 text-sm">Pilih lowongan untuk lihat kandidat.</p>}
        <div className="grid gap-3">
          {applicants.map((app) => (
            <div key={app.id} className="bg-white p-3 rounded shadow">
              <p className="font-semibold">{app.jobSeeker?.name}</p>
              <p className="text-sm text-gray-600">{app.jobSeeker?.email}</p>
              <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)} className="mt-2 border rounded px-2 py-1 text-sm">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
          {selectedJobId && applicants.length === 0 && <p className="text-gray-500 text-sm">Belum ada kandidat.</p>}
        </div>
      </div>
    </div>
  );
}