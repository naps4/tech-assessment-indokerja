# IndoKerja.id - Job Application Management

Aplikasi web sederhana untuk mensimulasikan proses Job Application pada platform IndoKerja.id.

## Tech Stack

**Backend:**
- Node.js + TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication (Passport)

**Frontend:**
- React.js + TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

## Struktur Project

```
.
├── backend/    # REST API (NestJS + Prisma + PostgreSQL)
└── frontend/   # React SPA (Vite)
```

## Fitur

- Register & Login sebagai Job Seeker atau Company (JWT-based auth)
- Job Seeker dapat melihat daftar & detail lowongan pekerjaan
- Job Seeker dapat melamar pekerjaan (tidak bisa apply job yang sama 2x)
- Job Seeker dapat melihat daftar lamaran beserta status terkininya
- Company dapat membuat lowongan pekerjaan baru
- Company dapat melihat kandidat yang melamar pada lowongan miliknya
- Company dapat mengubah status lamaran (Applied → Reviewing → Shortlisted/Rejected/Accepted)
- Setiap perubahan status tercatat di Application History

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js v18+
- PostgreSQL (local atau cloud, misal Supabase/Neon)

### 1. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/` dengan isi:

```
DATABASE_URL="postgresql://user:password@localhost:5432/indokerja"
JWT_SECRET="ganti-dengan-string-acak-yang-panjang"
PORT=3000
```

Jalankan migration untuk membuat tabel di database:

```bash
npx prisma migrate deploy
```

Jalankan server:

```bash
npm run start:dev
```

Backend akan berjalan di `http://localhost:3000`.

### 2. Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

### 3. Coba Aplikasi

1. Buka `http://localhost:5173`
2. Register akun baru sebagai **Job Seeker** atau **Company**
3. Job Seeker: lihat daftar lowongan, klik salah satu untuk melihat detail dan melamar
4. Company: buka halaman Dashboard untuk membuat lowongan baru dan mengelola kandidat

## Database Schema

Lihat `backend/prisma/schema.prisma` untuk detail lengkap. Ringkasan entitas:

- **User** — job seeker atau company (dibedakan lewat field `role`)
- **Job** — lowongan pekerjaan, dimiliki oleh satu User (company)
- **Application** — lamaran dari job seeker ke sebuah job, unik per (jobId, jobSeekerId)
- **ApplicationHistory** — riwayat perubahan status setiap application

## Dokumentasi API

Lihat file [`API.md`](./API.md) untuk daftar lengkap endpoint.

## Live Demo
- Frontend: https://tech-assessment-indokerja.vercel.app
- Backend API: https://tech-assessment-indokerja-production.up.railway.app

## Catatan

Project ini dibuat dalam rangka Tech Assessment IndoKerja.id (Full Stack Developer), dengan fokus pada functional requirement, code quality, database design, API design, dan security sesuai spesifikasi yang diberikan.
