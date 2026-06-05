# Clutch — Developer Activity Dashboard

> GitHub tracks your work. Clutch tracks you.

Clutch is an open source developer dashboard that connects to your GitHub and gives you commit streaks, activity patterns, language breakdowns, and AI-powered weekly insights. It also ships with a CLI so you can check your stats without opening a browser.

Live at [clutch-laypatel.netlify.app](https://clutch-laypatel.netlify.app)

---

## What it does

- Tracks your commit streaks and longest active periods
- Shows your activity chart for the last 30 days using the GitHub GraphQL API
- Detects your most productive days and top repositories
- Generates a weekly AI summary of your coding activity using Groq
- Provides a public profile page at `/u/your-username`
- Ships a CLI tool for quick terminal access to your stats

---

## Project Structure

```
clutch/
│
├── backend/                        # FastAPI backend
│   ├── app/
│   │   ├── main.py                 # App entry point, registers all routers
│   │   ├── settings.py             # Environment variables and config
│   │   ├── database.py             # SQLAlchemy database connection and session
│   │   ├── dependencies.py         # JWT authentication middleware
│   │   │
│   │   ├── models/
│   │   │   ├── user.py             # User model — stores GitHub profile and tokens
│   │   │   ├── activity.py         # DailyActivity model — stores synced GitHub stats
│   │   │   └── insight.py          # WeeklyInsight model — stores AI generated insights
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py             # GitHub OAuth flow and JWT creation
│   │   │   ├── github.py           # Activity, streak, language and sync endpoints
│   │   │   ├── users.py            # User profile endpoints
│   │   │   └── insights.py         # AI insight and pattern detection endpoints
│   │   │
│   │   └── services/
│   │       ├── github_service.py   # GitHub GraphQL API calls and data processing
│   │       └── insights_service.py # Groq AI integration and pattern detection
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                       # React + TypeScript frontend
│   ├── src/
│   │   ├── main.tsx                # React entry point
│   │   ├── App.tsx                 # Router setup and protected routes
│   │   ├── index.css               # Global styles and design tokens
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx     # Auth state management and JWT handling
│   │   │
│   │   ├── utils/
│   │   │   └── api.ts              # Axios instance with auth interceptors
│   │   │
│   │   └── pages/
│   │       ├── Landing.tsx         # Landing page with sign in
│   │       ├── Dashboard.tsx       # Main dashboard with stats and charts
│   │       ├── Profile.tsx         # Public user profile page
│   │       └── AuthCallback.tsx    # Handles GitHub OAuth redirect and token storage
│   │
│   ├── public/
│   │   └── _redirects              # Netlify SPA routing config
│   ├── package.json
│   └── .env.example
│
└── cli/                            # Typer CLI tool
    ├── clutch_cli/
    │   ├── main.py                 # CLI entry point, registers all commands
    │   ├── config.py               # Token storage in ~/.clutch/config.json
    │   ├── api.py                  # Authenticated HTTP client
    │   ├── auth.py                 # login, logout, whoami commands
    │   ├── streak.py               # clutch streak command
    │   ├── stats.py                # clutch stats command
    │   ├── insight.py              # clutch insight command
    │   ├── repos.py                # clutch repos command
    │   └── patterns.py             # clutch patterns command
    └── setup.py
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, SQLAlchemy, SQLite (dev) / PostgreSQL (prod) |
| Frontend | React, TypeScript, Tailwind CSS, Recharts |
| Auth | GitHub OAuth + JWT |
| AI | Groq API (llama-3.1-8b-instant) |
| Data | GitHub GraphQL API |
| CLI | Typer, Rich, httpx |
| Deploy | Render (backend), Netlify (frontend) |

---

## Running Locally

### Prerequisites

- Python 3.11 or higher
- Node.js 20 or higher
- A GitHub OAuth app
- A Groq API key

### 1. Create a GitHub OAuth App

Go to [github.com/settings/developers](https://github.com/settings/developers) and create a new OAuth app with these settings:

```
Homepage URL:            http://localhost:5173
Authorization callback:  http://localhost:8000/auth/github/callback
```

Copy the Client ID and Client Secret.

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in your `.env` file:

```
DATABASE_URL=sqlite:///./clutch.db
SECRET_KEY=any-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
GROQ_API_KEY=your_groq_key
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in your `.env` file:

```
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. CLI Setup

> Note: The CLI is not yet published to PyPI. It must be installed locally from the source.

```bash
cd cli
pip install -e .
```

Set the API URL to your local backend:

```bash
export CLUTCH_API_URL=http://localhost:8000
```

Login and start using it:

```bash
clutch auth login
clutch streak
clutch stats
clutch insight
clutch repos
clutch patterns
```
after running this command:
```
clutch auth login
```

It will ask you for a jwt token to get that try doing this:

>The JWT token appears in the URL like this:
```
https://clutch-laypatel.netlify.app/auth/callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

```

or you can open console too if you dont get it in URL

>while being on the page that you got redirected to press:
```
Command + Option + J (Mac)
Control + Shift + J (Windows)
```
<img width="1124" height="444" alt="Screenshot 2026-06-05 at 7 19 37 PM" src="https://github.com/user-attachments/assets/a42736ef-c0f5-4875-b534-7ad75cfcc7cd" />


feed that token back to terminal and you will be logged in.
<h5>Really sorry for the inconvenience in this one. I was not able to manage it all in 6 days.</h5>

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/github` | Start GitHub OAuth |
| GET | `/auth/github/callback` | OAuth callback |
| GET | `/users/me` | Authenticated user profile |
| GET | `/users/{username}` | Public user profile |
| GET | `/github/activity` | Activity for last N days |
| GET | `/github/streak` | Current and longest streak |
| GET | `/github/languages` | Language breakdown |
| POST | `/github/sync` | Sync activity to database |
| GET | `/insights/weekly` | AI weekly insight |
| GET | `/insights/patterns` | Coding pattern detection |

---

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite or PostgreSQL connection string |
| `SECRET_KEY` | Secret key for JWT signing |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `GITHUB_REDIRECT_URI` | OAuth callback URL |
| `GROQ_API_KEY` | Groq API key for AI insights |
| `FRONTEND_URL` | Frontend URL for redirects |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## Roadmap

The following features are planned for community contributions over the next 45 days:

- WakaTime integration for actual coding time tracking
- GitLab activity support
- Contribution heatmap visualization
- Dev.to and Hashnode article tracking
- Public leaderboard
- Publish `clutch-dev` to PyPI
- VS Code extension showing streak in status bar
- Badge embeds for GitHub READMEs
- Email weekly digest

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions and the commit convention.

Look for issues labeled `good first issue` to get started.

---

## License

MIT — free to use, modify, and distribute.
