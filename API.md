# API Documentation

Base URL: `http://localhost:3000`

Semua request/response menggunakan format JSON. Endpoint yang butuh autentikasi memerlukan header:

```
Authorization: Bearer <access_token>
```

---

## Auth

### Register

`POST /auth/register`

Body:
```json
{
  "name": "Budi Santoso",
  "email": "budi@mail.com",
  "password": "123456",
  "role": "JOB_SEEKER"
}
```

`role` bernilai `"JOB_SEEKER"` atau `"COMPANY"`.

Response `201`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Error `409` jika email sudah terdaftar.

### Login

`POST /auth/login`

Body:
```json
{
  "email": "budi@mail.com",
  "password": "123456"
}
```

Response `200/201`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Error `401` jika email/password salah.

---

## Jobs

### List semua lowongan

`GET /jobs`

Tidak perlu autentikasi. Response `200`:
```json
[
  {
    "id": 1,
    "title": "Backend Developer",
    "description": "...",
    "location": "Jakarta",
    "salary": 8000000,
    "jobType": "FULL_TIME",
    "companyId": 1,
    "createdAt": "...",
    "company": { "id": 1, "name": "PT Maju Jaya" }
  }
]
```

### Detail lowongan

`GET /jobs/:id`

Tidak perlu autentikasi. Response `200`: satu object job (lihat struktur di atas). Error `404` jika tidak ditemukan.

### Buat lowongan baru

`POST /jobs` — **role: COMPANY**

Header: `Authorization: Bearer <token_company>`

Body:
```json
{
  "title": "Backend Developer",
  "description": "Membangun REST API menggunakan NestJS",
  "location": "Jakarta",
  "salary": 8000000,
  "jobType": "FULL_TIME"
}
```

`jobType` salah satu dari: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`.

Response `201`: object job yang baru dibuat.
Error `401` jika belum login, `403` jika role bukan COMPANY, `400` jika validasi gagal.

### Lihat kandidat pada suatu lowongan

`GET /jobs/:id/applications` — **role: COMPANY, harus pemilik job**

Header: `Authorization: Bearer <token_company>`

Response `200`:
```json
[
  {
    "id": 1,
    "jobId": 1,
    "jobSeekerId": 2,
    "status": "APPLIED",
    "createdAt": "...",
    "jobSeeker": { "id": 2, "name": "Budi", "email": "budi@mail.com" }
  }
]
```

Error `404` jika job tidak ditemukan atau bukan milik company yang login.

---

## Applications

### Melamar pekerjaan

`POST /applications` — **role: JOB_SEEKER**

Header: `Authorization: Bearer <token_job_seeker>`

Body:
```json
{ "jobId": 1 }
```

Response `201`: object application baru dengan `status: "APPLIED"`.
Error `409` jika sudah pernah melamar job ini sebelumnya.

### Lihat lamaran sendiri

`GET /applications/me` — **role: JOB_SEEKER**

Header: `Authorization: Bearer <token_job_seeker>`

Response `200`:
```json
[
  {
    "id": 1,
    "jobId": 1,
    "status": "APPLIED",
    "createdAt": "...",
    "job": {
      "id": 1,
      "title": "Backend Developer",
      "location": "Jakarta",
      "jobType": "FULL_TIME",
      "company": { "id": 1, "name": "PT Maju Jaya" }
    }
  }
]
```

### Ubah status lamaran

`PATCH /applications/:id/status` — **role: COMPANY, harus pemilik job terkait**

Header: `Authorization: Bearer <token_company>`

Body:
```json
{ "status": "REVIEWING" }
```

`status` salah satu dari: `APPLIED`, `REVIEWING`, `SHORTLISTED`, `REJECTED`, `ACCEPTED`.

Response `200`: object application dengan status terbaru. Setiap perubahan otomatis dicatat di Application History.
Error `403` jika application bukan milik job dari company yang login.

### Lihat riwayat status lamaran

`GET /applications/:id/history`

Header: `Authorization: Bearer <token>` (job seeker pemilik lamaran ATAU company pemilik job terkait)

Response `200`:
```json
[
  { "id": 1, "applicationId": 1, "status": "APPLIED", "createdAt": "..." },
  { "id": 2, "applicationId": 1, "status": "REVIEWING", "createdAt": "..." }
]
```

Error `403` jika bukan pihak yang berhak melihat.

---

## Error Response Format

Semua error mengikuti format standar NestJS:

```json
{
  "message": "Pesan error di sini",
  "error": "Bad Request",
  "statusCode": 400
}
```

| Status | Arti |
|---|---|
| 400 | Validasi input gagal |
| 401 | Belum login / token tidak valid |
| 403 | Tidak punya akses (role atau ownership salah) |
| 404 | Data tidak ditemukan |
| 409 | Konflik (misal: email sudah terdaftar, duplikat lamaran) |
