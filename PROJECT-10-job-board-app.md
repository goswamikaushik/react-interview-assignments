# 🧑‍💼 React Interview Assignment — Project 10
## Job Board App

> **Time Limit:** 90 minutes  
> **Difficulty:** Medium–Hard  
> **Mock API:** Static JSON (provided below) + JSONPlaceholder for applications  
> **Your job:** Read this file fully before writing a single line of code.

---

## 📋 Table of Contents

1. [What You're Building](#what-youre-building)
2. [Mock Data](#mock-data)
3. [Feature Requirements](#feature-requirements)
4. [Constraints](#constraints)
5. [Component Architecture](#component-architecture)
6. [Application Flow](#application-flow)
7. [localStorage Rules](#localstorage-rules)
8. [What the Evaluator Checks](#what-the-evaluator-checks)
9. [Folder Structure](#folder-structure)
10. [Do Not Do](#do-not-do)

---

## What You're Building

A job listing and application tracker. Users can:
- Browse job listings
- Search and filter jobs
- View full job details
- Apply to a job via a form
- Save jobs to a "Saved Jobs" list
- Track application status (Applied / Saved / Rejected)
- All saved jobs and applications persist across refresh

Three views. React Router required.

---

## Mock Data

Create `src/data/jobs.js`:

```js
export const JOBS = [
  {
    id: "j001",
    title: "Frontend Developer",
    company: "Razorpay",
    location: "Bangalore",
    type: "Full-time",
    remote: true,
    salary: "₹18L – ₹28L",
    experience: "2–4 years",
    category: "Engineering",
    tags: ["React", "TypeScript", "Node.js"],
    description: "Build and maintain scalable frontend systems for India's leading fintech platform. You'll work closely with design and backend teams to ship features used by millions.",
    requirements: [
      "2+ years React experience",
      "Strong TypeScript skills",
      "Experience with REST APIs",
      "Understanding of performance optimization"
    ],
    postedAt: "2024-01-10T10:00:00.000Z"
  },
  {
    id: "j002",
    title: "Full Stack Engineer",
    company: "Zepto",
    location: "Mumbai",
    type: "Full-time",
    remote: false,
    salary: "₹20L – ₹35L",
    experience: "3–5 years",
    category: "Engineering",
    tags: ["React", "Node.js", "PostgreSQL", "Redis"],
    description: "Join a fast-growing quick commerce startup. Own end-to-end features across our customer, ops, and partner apps.",
    requirements: [
      "3+ years full stack experience",
      "React + Node.js proficiency",
      "Database design experience",
      "Startup mindset — move fast"
    ],
    postedAt: "2024-01-12T09:00:00.000Z"
  },
  {
    id: "j003",
    title: "UI/UX Designer",
    company: "CRED",
    location: "Bangalore",
    type: "Full-time",
    remote: true,
    salary: "₹15L – ₹25L",
    experience: "2–5 years",
    category: "Design",
    tags: ["Figma", "Design Systems", "Prototyping"],
    description: "Craft world-class experiences for CRED's premium member base. We care deeply about pixel-perfect execution and thoughtful UX.",
    requirements: [
      "Strong Figma skills",
      "Experience with design systems",
      "Portfolio demonstrating product thinking",
      "Eye for typography and motion"
    ],
    postedAt: "2024-01-08T11:00:00.000Z"
  },
  {
    id: "j004",
    title: "Backend Engineer",
    company: "Meesho",
    location: "Bangalore",
    type: "Full-time",
    remote: false,
    salary: "₹16L – ₹26L",
    experience: "2–4 years",
    category: "Engineering",
    tags: ["Node.js", "Microservices", "AWS", "Kafka"],
    description: "Scale our backend systems to support 100M+ users. Work on distributed systems, data pipelines, and high-throughput APIs.",
    requirements: [
      "Node.js or Go experience",
      "Distributed systems knowledge",
      "AWS familiarity",
      "Experience with message queues"
    ],
    postedAt: "2024-01-14T08:00:00.000Z"
  },
  {
    id: "j005",
    title: "Product Manager",
    company: "PhonePe",
    location: "Bangalore",
    type: "Full-time",
    remote: false,
    salary: "₹25L – ₹45L",
    experience: "3–6 years",
    category: "Product",
    tags: ["Product Strategy", "Fintech", "Data Analysis"],
    description: "Drive product vision for PhonePe's payments infrastructure. Work with engineering, design, and business teams to define and ship impactful features.",
    requirements: [
      "3+ years PM experience",
      "Fintech or consumer product background",
      "Strong analytical skills",
      "Excellent communication"
    ],
    postedAt: "2024-01-11T10:00:00.000Z"
  },
  {
    id: "j006",
    title: "React Native Developer",
    company: "Swiggy",
    location: "Bangalore",
    type: "Full-time",
    remote: true,
    salary: "₹18L – ₹30L",
    experience: "2–4 years",
    category: "Engineering",
    tags: ["React Native", "iOS", "Android", "Redux"],
    description: "Build the mobile experience for India's leading food delivery platform. Millions of orders flow through the app you'll build every day.",
    requirements: [
      "2+ years React Native",
      "Published apps on App Store / Play Store",
      "Performance profiling experience",
      "Understanding of native bridge concepts"
    ],
    postedAt: "2024-01-13T14:00:00.000Z"
  },
  {
    id: "j007",
    title: "Data Scientist",
    company: "Flipkart",
    location: "Bangalore",
    type: "Full-time",
    remote: false,
    salary: "₹20L – ₹40L",
    experience: "2–5 years",
    category: "Data",
    tags: ["Python", "ML", "SQL", "Spark"],
    description: "Build ML models that power Flipkart's recommendation, fraud detection, and pricing systems at scale.",
    requirements: [
      "Python + ML libraries (sklearn, pytorch)",
      "SQL proficiency",
      "Experience with A/B testing",
      "Big data tools (Spark, Hive)"
    ],
    postedAt: "2024-01-09T09:00:00.000Z"
  },
  {
    id: "j008",
    title: "DevOps Engineer",
    company: "Ola",
    location: "Bangalore",
    type: "Full-time",
    remote: true,
    salary: "₹16L – ₹28L",
    experience: "2–4 years",
    category: "Engineering",
    tags: ["Kubernetes", "Docker", "CI/CD", "Terraform"],
    description: "Own and improve Ola's cloud infrastructure. Build pipelines, manage Kubernetes clusters, and ensure 99.99% uptime for ride-hailing operations.",
    requirements: [
      "Kubernetes + Docker experience",
      "CI/CD pipeline design",
      "Terraform or Pulumi",
      "On-call rotation experience"
    ],
    postedAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: "j009",
    title: "Content Writer",
    company: "Unacademy",
    location: "Bangalore",
    type: "Contract",
    remote: true,
    salary: "₹6L – ₹10L",
    experience: "1–3 years",
    category: "Content",
    tags: ["Technical Writing", "EdTech", "SEO"],
    description: "Create high-quality educational content for competitive exam aspirants. Work with educators to turn complex topics into clear, structured material.",
    requirements: [
      "Strong written English",
      "EdTech or academic content background",
      "SEO writing familiarity",
      "Ability to simplify complex topics"
    ],
    postedAt: "2024-01-07T12:00:00.000Z"
  },
  {
    id: "j010",
    title: "Frontend Intern",
    company: "Groww",
    location: "Bangalore",
    type: "Internship",
    remote: false,
    salary: "₹25K – ₹40K/month",
    experience: "0–1 year",
    category: "Engineering",
    tags: ["React", "JavaScript", "CSS"],
    description: "Join Groww's frontend team as an intern. Work on real features used by millions of investors. Strong mentorship and PPO opportunity.",
    requirements: [
      "React basics",
      "Strong JavaScript fundamentals",
      "Willingness to learn fast",
      "Available for 6-month full-time internship"
    ],
    postedAt: "2024-01-16T09:00:00.000Z"
  },
  {
    id: "j011",
    title: "iOS Developer",
    company: "Paytm",
    location: "Noida",
    type: "Full-time",
    remote: false,
    salary: "₹15L – ₹25L",
    experience: "2–4 years",
    category: "Engineering",
    tags: ["Swift", "SwiftUI", "iOS", "Xcode"],
    description: "Build native iOS features for Paytm's super-app used by 300M+ users. Work on payments, banking, and commerce experiences.",
    requirements: [
      "Swift + SwiftUI proficiency",
      "App Store submission experience",
      "UIKit knowledge",
      "Understanding of iOS security model"
    ],
    postedAt: "2024-01-06T10:00:00.000Z"
  },
  {
    id: "j012",
    title: "Scrum Master",
    company: "Infosys",
    location: "Pune",
    type: "Full-time",
    remote: true,
    salary: "₹12L – ₹20L",
    experience: "3–6 years",
    category: "Product",
    tags: ["Agile", "Scrum", "JIRA", "Stakeholder Management"],
    description: "Facilitate agile delivery for enterprise software teams. Remove blockers, coach teams on scrum, and drive continuous improvement.",
    requirements: [
      "CSM or PSM certification preferred",
      "3+ years agile coaching",
      "JIRA administration experience",
      "Strong facilitation skills"
    ],
    postedAt: "2024-01-05T11:00:00.000Z"
  },
]
```

---

## Feature Requirements

### F1 — Jobs Listing Page (`/`)

- Load all jobs from mock data on mount (no async needed — data is local)
- Render each job as a `JobCard` component
- Show total job count: `"12 Jobs Found"` — updates with filters

---

### F2 — JobCard

Each card shows:
- Company name
- Job title
- Location + Remote badge (if `remote: true`)
- Job type badge (Full-time / Contract / Internship) — color-coded
- Experience required
- Salary range
- Tags (tech stack chips — show max 3, `+N more` if more exist)
- Posted date: `"5 days ago"` format
- Save/Unsave button (bookmark icon)
- "View Details" button → navigates to `/job/:id`
- If already applied → show `"Applied ✓"` badge on card

---

### F3 — Search

- Input at top — searches across `title`, `company`, and `tags` (case-insensitive)
- Debounced 300ms
- Resets to page 1 on change

---

### F4 — Filters

All client-side. All work together with search.

| Filter | Type | Options |
|---|---|---|
| Category | Select | All + Engineering / Design / Product / Data / Content |
| Job Type | Select | All + Full-time / Contract / Internship |
| Remote Only | Checkbox/Toggle | Shows only `remote: true` jobs |
| Location | Select | All + unique locations from data |

- "Clear All Filters" button — resets all filters + search
- Active filter count shown: `"3 filters active"`

---

### F5 — Pagination

- 6 jobs per page
- Previous / Next buttons
- `Page X of Y`
- Disabled at ends
- Resets on filter/search change

---

### F6 — Job Detail Page (`/job/:id`)

- Find job by `id` from mock data (no async fetch — data is local)
- Show full job details:
  - Company + title
  - Location, type, remote, salary, experience
  - All tags
  - Full description
  - Requirements as a list
  - Posted date (formatted)
- Save/Unsave button
- "Apply Now" button → opens application form (inline or modal)
- If already applied → show `"You have applied for this role"` banner (no Apply button)
- Back button → `/`

---

### F7 — Application Form

Shown inline below job details or as a modal — your choice.

Fields:
- **Full Name** — required
- **Email** — required, valid format
- **Phone** — required, 10 digits
- **Years of Experience** — number, min 0
- **Cover Note** — textarea, optional, max 500 characters
- **Resume Link** — URL input, optional

On submit:
- Validate all required fields
- Add to `applications` state with:
  ```js
  {
    jobId: "j001",
    appliedAt: ISO string,
    status: "applied",    // "applied" | "rejected"
    formData: { name, email, phone, experience, coverNote, resumeLink }
  }
  ```
- Show success message: `"Application submitted for [Job Title] at [Company]!"`
- Close form
- Card and detail page now show `"Applied ✓"` badge

---

### F8 — Saved Jobs Page (`/saved`)

- Shows all saved jobs as `JobCard` grid
- Empty state: `"No saved jobs yet. Browse listings and bookmark jobs you're interested in."`
- Unsave button works from this page too
- Clicking card navigates to job detail

---

### F9 — My Applications Page (`/applications`)

- Shows all jobs the user has applied to
- Each row shows:
  - Job title + company
  - Applied date: `"Applied 3 Jan 2024"`
  - Status badge: `Applied` (green) or `Rejected` (red)
  - "Mark as Rejected" button (if status is `applied`)
  - View job button

---

### F10 — Navigation Header

- App name + logo
- Links: `Jobs` / `Saved (N)` / `Applications (N)`
- Active link highlighted

---

## Constraints

```
1. React Router v6 — useParams, Link, NavLink, useNavigate
2. No external state library
3. Saved jobs + applications are global state — Context or lifted to App
4. Search is debounced — 300ms
5. All filtering is client-side — derived, not stored in state
6. Pagination is client-side — slice from filtered array
7. Job data is local (no async) — no loading state needed for listings
8. Application form requires real validation with inline errors
9. No index as key — use job.id and application jobId+appliedAt combo
10. No external UI library
```

---

## Component Architecture

```
App  (Router + JobContext)
├── Header  (with Saved + Application counts)
│
├── Route: /
│     └── JobsPage
│           ├── SearchBar  (debounced)
│           ├── FilterBar
│           │     ├── CategorySelect
│           │     ├── TypeSelect
│           │     ├── LocationSelect
│           │     ├── RemoteToggle
│           │     └── ClearFiltersButton
│           ├── ResultCount  ("12 Jobs Found")
│           ├── JobGrid
│           │     └── JobCard  (× N)
│           └── Pagination
│
├── Route: /job/:id
│     └── JobDetailPage
│           ├── BackButton
│           ├── JobHeader  (company, title, badges)
│           ├── JobMeta  (salary, location, type, experience)
│           ├── JobBody  (description, requirements)
│           ├── SaveButton
│           ├── ApplyButton  OR  AppliedBanner
│           └── ApplicationForm  (shown on apply click)
│
├── Route: /saved
│     └── SavedJobsPage
│           ├── JobGrid
│           └── EmptyState
│
└── Route: /applications
      └── ApplicationsPage
            ├── ApplicationRow  (× N)
            └── EmptyState
```

**Global state (JobContext):**
```js
{
  savedJobIds: [],         // array of job IDs
  applications: [],        // array of application objects
  saveJob(jobId),
  unsaveJob(jobId),
  isSaved(jobId),
  applyToJob(application),
  markRejected(jobId),
  hasApplied(jobId)
}
```

---

## Application Flow

```
User on /job/j001
  → Clicks "Apply Now"
  → Application form appears
  → Fills fields + submits
  → Validation passes
  → application added to context:
      { jobId: "j001", appliedAt: ISO, status: "applied", formData: {...} }
  → Form disappears
  → "You have applied for this role" banner shown
  → JobCard on listings also shows "Applied ✓" badge
  → /applications page shows this entry

User on /applications
  → Sees application row
  → Clicks "Mark as Rejected"
  → status changes to "rejected"
  → Badge turns red
```

---

## "Posted X days ago" Logic

```js
function getPostedAgo(isoString) {
  const posted  = new Date(isoString)
  const now     = new Date()
  const diffMs  = now - posted
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}
```

---

## localStorage Rules

```js
// Keys: "savedJobs" and "applications"

// Save on change
useEffect(() => {
  localStorage.setItem("savedJobs", JSON.stringify(savedJobIds))
}, [savedJobIds])

useEffect(() => {
  localStorage.setItem("applications", JSON.stringify(applications))
}, [applications])

// Init
const initSaved = () => {
  try { return JSON.parse(localStorage.getItem("savedJobs")) || [] }
  catch { return [] }
}

const initApplications = () => {
  try { return JSON.parse(localStorage.getItem("applications")) || [] }
  catch { return [] }
}
```

---

## What the Evaluator Checks

### ✅ Must Pass

- [ ] All 12 jobs render on home page
- [ ] Job count updates with active filters
- [ ] Search filters across title, company, tags
- [ ] Search is debounced
- [ ] Category filter works
- [ ] Job type filter works
- [ ] Remote only toggle works
- [ ] All filters combine correctly
- [ ] "Clear All Filters" resets everything
- [ ] Pagination shows 6 per page
- [ ] Page resets on filter change
- [ ] Clicking card navigates to detail page
- [ ] Detail page shows full job info
- [ ] Apply form validates all required fields with inline errors
- [ ] Submitting application shows success message
- [ ] Applied badge appears on card after application
- [ ] Apply button replaced by banner on detail after applying
- [ ] Save/Unsave toggle works from both listing and detail
- [ ] Saved Jobs page shows saved jobs
- [ ] Applications page shows applied jobs with status
- [ ] "Mark as Rejected" changes status
- [ ] Saved jobs + applications persist after refresh
- [ ] Header counts are correct
- [ ] No console errors

### ⭐ Senior-Level Bonus

- [ ] `useDebounce` as a custom hook
- [ ] `React.memo` on `JobCard`
- [ ] `useMemo` for filtered + paginated job list
- [ ] Tags capped at 3 with `+N more` shown
- [ ] `getPostedAgo` utility function used on all cards
- [ ] Active filter count badge shown on filter bar
- [ ] Form character count shown on cover note textarea (e.g. `"240/500"`)

---

## Folder Structure

```
src/
├── components/
│   ├── Header/
│   ├── JobCard/
│   ├── JobGrid/
│   ├── SearchBar/
│   ├── FilterBar/
│   ├── Pagination/
│   ├── ApplicationForm/
│   ├── ApplicationRow/
│   └── EmptyState/
├── pages/
│   ├── JobsPage.jsx
│   ├── JobDetailPage.jsx
│   ├── SavedJobsPage.jsx
│   └── ApplicationsPage.jsx
├── context/
│   └── JobContext.jsx
├── hooks/
│   └── useDebounce.js
├── data/
│   └── jobs.js
├── utils/
│   └── dateUtils.js       ← getPostedAgo function
├── App.jsx
└── main.jsx
```

---

## Do Not Do

```
❌ Do NOT store filteredJobs in state — derive it
❌ Do NOT allow Apply button to show after user has already applied to a job
❌ Do NOT skip form validation — all required fields must show inline errors
❌ Do NOT store saved jobs or applications in a single page's local state
❌ Do NOT use index as key on job cards or application rows
❌ Do NOT forget to reset pagination on filter or search changes
❌ Do NOT show loading state for job listings — data is local, no async needed
```

---

## Quick Start

```bash
npm create vite@latest job-board-app -- --template react
cd job-board-app
npm install react-router-dom
npm run dev
```

> **Reminder:** Plan your Context shape and page routes on paper first.  
> The evaluator is checking that saved state and application state are global — not siloed per page.  
> Two pages reading the same context is worth more than one perfect page.
