# KasirKu

Aplikasi kasir modern untuk toko kecil, warung, kios, dan usaha sederhana.

## 🎯 Konsep Utama

**"Kasir sederhana yang bisa langsung dipakai dari HP."**

KasirKu dirancang dengan fokus pada:
- ⚡ **Kecepatan transaksi** — kasir bisa menyelesaikan transaksi dalam beberapa langkah
- 📱 **Mobile-first** — responsif di HP, tablet, dan desktop
- 🚀 **Offline-first** — tetap bisa beroperasi tanpa internet
- 🎨 **Clean & Modern** — desain yang bersih, profesional, dan tidak berlebihan
- 🔄 **Sinkronisasi otomatis** — data tersinkronisasi ketika internet kembali

## ✨ Fitur Utama

### Kasir
- Pencarian produk (nama, kode, barcode)
- Scan barcode dengan kamera
- Keranjang transaksi real-time
- Berbagai metode pembayaran (tunai, QRIS, debit/kartu)
- Hold transaksi (untuk pelanggan yang belum selesai memilih)

### Manajemen Produk
- Tambah/edit/hapus produk
- Kategori produk
- Tracking stok otomatis
- Restock produk
- Riwayat perubahan stok

### Transaksi
- Riwayat transaksi lengkap
- Filter dan pencarian transaksi
- Void/refund transaksi
- Struk digital (print/PDF/bagikan)
- Nomor transaksi yang mudah dibaca

### Laporan
- Dashboard overview (omzet hari ini, transaksi, produk terlaris)
- Laporan penjualan per periode
- Produk terlaris
- Filter laporan (hari ini, 7 hari, 30 hari, custom)

### Pengaturan
- Informasi toko (nama, alamat, telepon, logo)
- Pengaturan struk
- Manajemen kasir (multi-user)
- Role-based access (Owner, Kasir)

## 🛠 Stack Teknologi

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Database:** Supabase (PostgreSQL + Auth)
- **Real-time:** Supabase Realtime
- **Offline:** Service Worker + IndexedDB (via dexie)
- **PWA:** Web App Manifest + Service Worker
- **Barcode Scanner:** JSQRCode
- **PDF/Print:** html2pdf

## 📁 Struktur Folder

```
src/
├── components/            # Reusable React components
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── services/             # Backend services
├── db/                   # Local database (IndexedDB)
├── utils/                # Utility functions
├── types/                # TypeScript interfaces
├── styles/               # Global styles
├── App.tsx               # Main App component
└── main.tsx              # Entry point
```

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
# Edit .env dengan Supabase credentials
npm run dev
```

## 📊 Database Schema

**Tabel utama:**
- users (dengan role: owner, kasir)
- stores
- products
- categories
- transactions
- transaction_items
- stock_movements
- settings
- sync_queue (untuk offline)

## 🔒 Keamanan

- Authentication via Supabase
- Role-based access control
- Row-level security
- Password hashing

## 📝 License

MIT
