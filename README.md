# Ujjwal Mehta — Portfolio (React + Node/Express + MongoDB)

A full-stack personal portfolio with a complete admin dashboard to manage
every section of the site (profile, skills, timeline, projects, certificates,
YouTube videos, gallery, and contact messages) — no code changes needed after
deployment.

- **Frontend:** React (Vite) → deploy on **Vercel**
- **Backend:** Node.js + Express + MongoDB (Mongoose) → deploy on **Render**
- **Images:** Cloudinary (free tier)
- **YouTube:** Auto-fetches your latest uploads via YouTube Data API v3, merged
  with videos you manually pin from the admin panel

---

## 1. Project structure

```
portfolio/
├── backend/          Express API + MongoDB models + admin auth
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── .env.example
└── frontend/          React (Vite) app — public site + /admin dashboard
    ├── src/
    │   ├── components/site/     public site sections
    │   ├── components/admin/    admin layout + route guard
    │   ├── pages/                PortfolioSite + all /admin pages
    │   ├── context/              Theme (dark mode) + Auth
    │   └── styles/               design tokens (colors, fonts)
    └── .env.example
```

---

## 2. Backend setup (local)

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:

1. **MONGO_URI** — create a free MongoDB Atlas cluster:
   - https://www.mongodb.com/cloud/atlas/register
   - Database Access → add a user + password
   - Network Access → Add IP → **Allow Access From Anywhere** (`0.0.0.0/0`)
   - Connect → Drivers → copy the connection string into `MONGO_URI`

2. **JWT_SECRET** — generate one:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **ADMIN_EMAIL / ADMIN_PASSWORD** — the login you'll use for `/admin`.

4. **CLOUDINARY_*** (optional but recommended for image uploads) — sign up
   free at https://cloudinary.com, the dashboard shows all 3 values directly.

5. **YOUTUBE_API_KEY** (optional, for auto-fetching your channel's videos):
   - https://console.cloud.google.com/ → new project → enable **YouTube Data
     API v3** → Credentials → Create API Key
   - `YOUTUBE_CHANNEL_HANDLE` is already set to `@Ujjwalmehta1`

Then seed your first admin account + starter content:

```bash
npm run seed
```

Run the server:

```bash
npm run dev
```

API will be live at `http://localhost:5000`.

---

## 3. Frontend setup (local)

```bash
cd frontend
npm install
cp .env.example .env
```

Set `VITE_API_URL=http://localhost:5000/api` in `.env` for local development.

```bash
npm run dev
```

Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/admin/login` to log in with the admin credentials you
set in the backend `.env`.

---

## 4. Deploying the backend to Render

1. Push this repo to GitHub.
2. On https://render.com → **New +** → **Web Service** → connect your repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all the environment variables from your `backend/.env` in Render's
   **Environment** tab (use your real Atlas URI, JWT secret, etc.)
7. Set `CLIENT_URL` to your Vercel frontend URL once you have it (you can
   update this later — comma-separate multiple URLs if needed, e.g. your
   Vercel URL + `http://localhost:5173`).
8. Deploy. Once live, note your Render URL, e.g. `https://your-app.onrender.com`.
9. SSH/Shell into the Render service (or run locally pointed at the same
   `MONGO_URI`) and run `npm run seed` once to create your admin account.

> **Note:** Render's free tier spins down after inactivity — the first request
> after idling may take 30–60 seconds to wake up. This is normal.

---

## 5. Deploying the frontend to Vercel

1. On https://vercel.com → **Add New** → **Project** → import your repo.
2. Root directory: `frontend`
3. Framework preset: **Vite**
4. Add environment variable: `VITE_API_URL=https://your-app.onrender.com/api`
   (your Render backend URL + `/api`)
5. Deploy.
6. Once deployed, copy your Vercel URL and update `CLIENT_URL` in Render's
   environment variables to match (redeploy the backend after).

---

## 6. Using the admin panel

Go to `https://your-site.vercel.app/admin/login` and sign in with the email
and password from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your backend `.env`.

From the dashboard sidebar you can manage:

- **Profile & Contact** — name, roles (typing effect), bio, photos, resume
  link, location/email/phone, and social links (Instagram, YouTube, Telegram,
  GitHub, LinkedIn)
- **Skills** — name, category, proficiency %, level
- **Timeline** — education and experience entries
- **Projects** — title, description, tags, image, code/live links
- **Certificates** — title, issuer, year, image, verify link
- **YouTube** — pin specific videos (paste any YouTube URL) that always show
  first, plus auto-fetched latest uploads from **@Ujjwalmehta1** when
  `YOUTUBE_API_KEY` is configured
- **Gallery** — optional photo gallery
- **Messages** — inbox of everything submitted through your contact form

All changes save to MongoDB and reflect on the live site immediately —
no redeploy needed for content changes.

---

## 7. Dark mode

The theme toggle in the navbar switches between light and dark palettes
(deep teal + amber, both light and dark variants) and persists the choice in
the browser via `localStorage`. It also respects the visitor's OS-level
preference on first visit.

---

## 8. Security notes

- Change `ADMIN_PASSWORD` immediately after your first login (there's a
  password-change endpoint at `PUT /api/auth/update-password`, or simply
  re-run the seed script with a new password after clearing the Admin
  collection in MongoDB).
- Login and contact-form endpoints are rate-limited to reduce abuse.
- Never commit your real `.env` files — only `.env.example` is meant to be
  committed.
