# Quick Setup Guide - Admin Dashboard

A fast reference guide for getting the admin dashboard up and running.

##  5-Minute Setup

### 1. Clone & Install (2 minutes)
```bash
git clone https://github.com/your-username/example.git
cd admin
npm install
```

### 2. Environment Setup (2 minutes)
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co/
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-api-key
```

Get your credentials from: https://supabase.com/dashboard → Settings → API

### 3. Start Development (1 minute)
```bash
npm run dev
```

Open http://localhost:3000 

---

## 📦 Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build            # Build for production
npm run lint             # Check code quality

# Git & Sync
git status               # Check current status
git pull origin main     # Pull latest changes
git add .                # Stage changes
git commit -m "msg"      # Commit changes
git push origin main     # Push to remote
```

---

## 🔑 Environment Variables

**File**: `.env.local` (auto-generated, not in git)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to get them**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy **Project URL** and **anon (public)** key

---

##  Important Files & Folders

```
admin/
├── .env.local              ← Your personal credentials (NOT in git)
├── .env.example            ← Template for team
├── src/
│   ├── app/
│   │   ├── actions.ts      ← Server functions (API logic)
│   │   ├── page.tsx        ← Dashboard page
│   │   └── layout.tsx      ← Root layout
│   ├── components/
│   │   ├── admin/          ← Feature components
│   │   │   ├── vehicles/   ← Vehicle CRUD
│   │   │   ├── agencies/   ← Agency CRUD
│   │   │   ├── users/      ← User management
│   │   │   └── ratings/    ← Ratings system
│   │   └── ui/             ← Reusable UI components
│   ├── lib/
│   │   ├── schemas.ts      ← Zod validation schemas
│   │   └── supabase-server.ts ← Supabase setup
│   └── types/
│       └── database.ts     ← TypeScript types
└── package.json            ← Dependencies
```

---





## 🔄 Pulling Latest Changes

```bash
# 1. Fetch from remote
git fetch origin

# 2. Pull changes
git pull origin main

# 3. Install new dependencies
npm install

# 4. Start dev server
npm run dev
```


## 🧪 Testing Your Setup

```bash
# Run development server
npm run dev

# Expected output:
# > Ready in 2.5s
# > Local:        http://localhost:3000

# Open in browser: http://localhost:3000
# You should see the dashboard
```

---

