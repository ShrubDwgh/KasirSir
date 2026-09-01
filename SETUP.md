# KasirSir Development Setup

## 📋 Prerequisites

- Node.js 18+
- npm atau yarn
- Supabase account
- Git

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/ShrubDwgh/KasirSir.git
cd KasirSir
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env` file:

```bash
cp .env.example .env
```

4. Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Setup Database

Run the SQL migrations in `supabase/migrations/` to create the database schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('owner', 'kasir')),
  status TEXT CHECK (status IN ('active', 'inactive')),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  currency TEXT DEFAULT 'IDR',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  barcode TEXT,
  category_id UUID,
  purchase_price NUMERIC NOT NULL,
  selling_price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  image_url TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id),
  kasir_id UUID NOT NULL REFERENCES users(id),
  transaction_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'qris', 'card', 'other')),
  amount_paid NUMERIC NOT NULL,
  change NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('completed', 'voided', 'refunded')) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  voided_at TIMESTAMP,
  voided_by UUID REFERENCES users(id)
);

-- Transaction Items table
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  product_id UUID NOT NULL REFERENCES products(id),
  product_name_snapshot TEXT NOT NULL,
  product_code TEXT NOT NULL,
  price_snapshot NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Run Development Server

```bash
npm run dev
```

Klik link yang muncul (biasanya http://localhost:5173) untuk membuka aplikasi.

## 📁 Project Structure

```
src/
├── components/      # React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
├── services/       # Supabase services
├── types/          # TypeScript types
├── utils/          # Utility functions
├── styles/         # CSS files
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## 🔨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Build for Production

```bash
npm run build
```

Output akan berada di folder `dist/`.

## 📱 PWA Setup

Aplikasi ini sudah dikonfigurasi sebagai PWA. Untuk mengaktifkan:

1. Berikan HTTPS certificate (di production)
2. Pastikan `manifest.json` sudah lengkap
3. Service Worker akan otomatis teraktifasi

## 🚀 Deployment

### Menggunakan Vercel

```bash
npm i -g vercel
vercel
```

### Menggunakan Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### Database Connection Error

- Pastikan Supabase URL dan key sudah benar di `.env`
- Cek network connectivity
- Pastikan table sudah dibuat di Supabase

### Port Already in Use

Jika port 5173 sudah dipakai:

```bash
npm run dev -- --port 3000
```

### Module Not Found

Jika ada error `Module not found`:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 License

MIT

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di GitHub.
