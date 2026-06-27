# CareTrack — Patient Outcome Review System

A professional healthcare SaaS tool that helps clinics track whether their patients actually recovered after treatment.

---

## What it does

1. **Reception registers a patient** → name, phone, doctor, complaint
2. **System schedules a follow-up SMS** after 3–5 days (configurable)
3. **Patient clicks the link** → fills a 3-step feedback form (60 seconds)
4. **Doctor views the dashboard** → live outcome board, analytics, side effect alerts

---

## Pages & features

| Page | Description |
|---|---|
| `/` | Live dashboard — stats, patient status board, attention alerts |
| `/register` | Register a new patient visit with follow-up scheduling |
| `/patients` | Full patient table with search, filters, detail drawer |
| `/analytics` | Charts — outcome breakdown, doctor recovery rates, satisfaction |
| `/feedback/:id` | Patient-facing feedback form (sent via SMS link) |

---

## Tech stack

- **Frontend** — React 18 + Vite
- **Routing** — React Router v6
- **Charts** — Recharts
- **Icons** — Lucide React + Tabler Icons
- **Date handling** — date-fns
- **Styling** — Pure CSS with CSS variables (no Tailwind dependency)

---

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Deploy (free)

### Frontend → Vercel
```bash
npm install -g vercel
vercel --prod
```

### Test patient feedback form
Navigate to `/feedback/p2` or `/feedback/p8` to see the patient-facing form for a pending patient.

---

## Future backend integration

This frontend is ready to connect to a Node.js + Express + PostgreSQL backend:

- Replace `INITIAL_PATIENTS` in `src/data/store.js` with API calls
- Add `POST /api/patients` for registration
- Add `GET /api/patients` for the dashboard
- Add `POST /api/feedback/:id` for feedback submission
- Add **MSG91 / Fast2SMS** webhook for automated SMS sending
- Add **node-cron** for scheduling the follow-up link dispatch

---

## Database schema (PostgreSQL)

```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  speciality VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(10) UNIQUE NOT NULL,
  visit_date DATE NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  complaint TEXT,
  followup_days INTEGER DEFAULT 4,
  link_sent BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  improvement VARCHAR(20),
  days_to_recover INTEGER,
  side_effects BOOLEAN,
  referred_elsewhere BOOLEAN,
  satisfaction INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
  notes TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

---

## Project structure

```
src/
├── components/
│   ├── Sidebar.jsx       # Navigation sidebar
│   └── StatusBadge.jsx   # Animated status indicator
├── data/
│   └── store.js          # Mock data + status metadata
├── pages/
│   ├── Dashboard.jsx     # Main overview
│   ├── RegisterPatient.jsx
│   ├── Patients.jsx      # Table + detail drawer
│   ├── Analytics.jsx     # Charts
│   └── FeedbackForm.jsx  # Patient-facing form
├── App.jsx               # Routing + state
├── main.jsx
└── index.css             # Global styles + animations
```

---

Built with ❤️ as a final-year engineering project. Domain: Healthcare SaaS.
