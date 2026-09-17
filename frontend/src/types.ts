export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number | null;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  companyId: number;
  createdAt: string;
  company: { id: number; name: string };
}

export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface Application {
  id: number;
  jobId: number;
  jobSeekerId: number;
  status: ApplicationStatus;
  createdAt: string;
  job?: { id: number; title: string; location: string; jobType: string; company: { id: number; name: string } };
  jobSeeker?: { id: number; name: string; email: string };
}