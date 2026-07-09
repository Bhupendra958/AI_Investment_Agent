# AI Investment Research Agent

An AI-powered investment research application that takes a company name, conducts multi-step research using a **LangGraph** agent, and returns an **INVEST** or **PASS** recommendation with detailed reasoning.

## Features

- **Multi-step AI research pipeline** (LangGraph + Gemini)
  1. Company overview & market position
  2. Financial analysis
  3. Risk assessment
  4. Final invest/pass decision with confidence score
- **React dashboard** with decision cards, key factors, and confidence visualization
- **Research history** saved per user in MongoDB
- **User authentication** (email/password + Google OAuth)
- **Profile page** with research statistics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI Framework | LangChain.js + LangGraph.js |
| LLM | Google Gemini 2.5 Flash |
| Database | MongoDB (Mongoose) |
| Auth | JWT + Google OAuth |

## Project Structure

```
AI-Investment-Agent/
├── client/          # React frontend
│   └── src/
│       ├── pages/       # Dashboard, History, Profile, Login, Register
│       ├── components/  # UI components
│       └── services/    # API client
└── server/          # Express backend
    ├── routes/          # API routes
    ├── services/        # LangGraph research agent
    ├── models/          # MongoDB schemas
    └── config/          # Database connection
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Google OAuth client ID (optional, for Google login)

### 1. Backend

```bash
cd server
npm install
```

Ensure `server/.env` contains (do not commit this file):

```
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email |
| POST | `/api/auth/login` | Login with email |
| POST | `/api/google/login` | Google OAuth login |
| POST | `/api/research` | Research a company (auth required) |
| GET | `/api/research` | Get research history |
| GET | `/api/research/:id` | Get single research |
| DELETE | `/api/research/:id` | Delete research |
| GET | `/api/user/profile` | Get user profile & stats |

## How the AI Agent Works

The research agent uses **LangGraph** to orchestrate a 4-node pipeline:

```
START → gatherOverview → analyzeFinancials → assessRisks → makeDecision → END
```

Each node calls Gemini with specialized prompts. The final node synthesizes all research into a structured JSON response with decision, confidence, reasoning, summary, and key factors.

## Disclaimer

This application generates AI-powered investment analysis for educational and demonstration purposes only. It is **not financial advice**. Always conduct your own research before making investment decisions.
