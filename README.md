# Sistem Informasi Pendataan Kerusakan Jalan

Sistem informasi berbasis web untuk pendataan dan monitoring kerusakan jalan dengan metode waterfall.

## Fitur Utama

1. **Autentikasi Admin**
   - Login dengan username dan password
   - Session management

2. **Dashboard**
   - Statistik kerusakan jalan
   - Data kerusakan terbaru
   - Quick actions

3. **Pendataan Kerusakan**
   - Input data kerusakan jalan
   - Edit dan hapus data
   - Filter data berdasarkan status dan tingkat kerusakan

4. **Laporan**
   - Generate laporan berdasarkan periode
   - Filter berdasarkan jenis kerusakan
   - Export data (PDF - future enhancement)

## Teknologi yang Digunakan

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Local Storage untuk penyimpanan data

## Metode Pengembangan: Waterfall

Sistem ini dikembangkan menggunakan metode Waterfall dengan tahapan:

### 1. Requirements Analysis
- Analisis kebutuhan sistem pendataan kerusakan jalan
- Identifikasi stakeholder: admin, pemerintah daerah
- Spesifikasi fungsional dan non-fungsional

### 2. System Design
- Desain arsitektur sistem
- Desain database (local storage structure)
- Desain antarmuka pengguna

### 3. Implementation
- Pengembangan frontend dengan HTML, CSS, JavaScript
- Implementasi logika bisnis
- Integrasi komponen

### 4. Testing
- Unit testing (manual)
- Integration testing
- User acceptance testing

### 5. Deployment
- Deployment ke environment production
- Dokumentasi sistem

### 6. Maintenance
- Perbaikan bug
- Update fitur
- Optimasi performa

## Instalasi dan Menjalankan

1. Clone atau download project ini
2. Buka file `index.html` di browser web
3. Untuk akses admin, login dengan:
   - Username: `admin`
   - Password: `admin123`

## Struktur Data

Data disimpan dalam localStorage dengan struktur:
```javascript
{
  id: number,
  lokasi: string,
  tingkat: 'ringan' | 'sedang' | 'berat',
  deskripsi: string,
  koordinat: string,
  tanggalLapor: string (YYYY-MM-DD),
  status: 'dilaporkan' | 'dalam_perbaikan' | 'selesai'
}# sistem-kerusakan-jalan
