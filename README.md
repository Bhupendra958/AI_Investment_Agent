<div align="center">
  <h1>AI Investment Research Agent 📈🤖</h1>
  <p>
    An AI-powered investment research application that orchestrates a multi-agent pipeline using <strong>LangGraph</strong> to evaluate companies and return data-driven <strong>INVEST</strong> or <strong>PASS</strong> verdicts.
  </p>
</div>

---

## 📖 Overview — What it does

The **AI Investment Research Agent** is a full-stack web application designed to automate the heavy lifting of financial research. Users enter a company name (e.g., "Apple", "Nvidia") into the dashboard, and a background AI workflow immediately goes to work:
1. **Gathers Company Overview & Market Position**
2. **Conducts Deep Financial Analysis**
3. **Assesses Adversarial Risks & Market Pressures**
4. **Synthesizes a Final Verdict (INVEST/PASS) with a Confidence Score**

The application features a premium, responsive React dashboard with glassmorphic UI, real-time AI Chat, MongoDB history tracking, and Google OAuth integration.

---

## ⚙️ How to run it

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Google OAuth client ID (optional, for Google login)

### 1. Clone the repository
```bash
git clone https://github.com/Bhupendra958/AI_Investment_Agent.git
cd AI_Investment_Agent
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:5173
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ How it works

### Approach & Architecture
The system utilizes a modern full-stack architecture coupled with a deterministic LLM orchestration framework.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion | Provides a dynamic, glassmorphic UI with animated data visualization and seamless UX. |
| **Backend** | Node.js, Express | Handles secure API routing, auth verification, and dispatches research jobs. |
| **AI Orchestration** | LangGraph.js, LangChain.js | State-machine based AI agent workflow that ensures sequential, structured reasoning. |
| **LLM** | Google Gemini 3.1 Flash Lite | High-speed, context-aware foundational model generating financial insights. |
| **Database** | MongoDB (Mongoose) | Persists user profiles, chat history, and generated research reports. |

### The LangGraph AI Pipeline
Instead of a single monolithic prompt, the AI uses a **4-node LangGraph pipeline** for robust reasoning:

`START` ➔ `gatherOverview` ➔ `analyzeFinancials` ➔ `assessRisks` ➔ `makeDecision` ➔ `END`

Each node executes specialized prompts via the `@google/genai` SDK and passes state to the next node, culminating in a structured JSON output.

---

## ⚖️ Key decisions & trade-offs

- **LangGraph over raw LLM calls:** 
  *Why:* Guaranteed execution order and separated concerns (Financials vs Risks). If one step fails, it's easier to debug.
  *Trade-off:* Higher latency than a single prompt and slightly more complex state management.
- **Gemini 3.1 Flash Lite vs Heavy Models:** 
  *Why:* Significantly lower latency for web application responsiveness while maintaining sufficient reasoning capability for high-level stock analysis.
- **Glassmorphic UI (Vanilla CSS/Tailwind):** 
  *Why:* Prioritized premium aesthetics to make the data digestible and engaging.
- **What was left out:** Real-time live stock API integrations (like Yahoo Finance or Alpha Vantage). The agent relies on the LLM's internal knowledge cutoff. With more time, integrating real-time live ticker data would be the immediate next step to prevent AI hallucinations on current pricing.

---

## 📊 Example runs

### 1. Nvidia (NVDA)
- **Decision:** `INVEST`
- **Confidence:** `88%`
- **Thesis:** Unprecedented demand for Hopper and Blackwell GPUs driven by the AI boom. Near-monopoly in data center AI training chips. Margins remain exceptionally high, though geopolitical export restrictions to China remain a core risk.

### 2. GameStop (GME)
- **Decision:** `PASS`
- **Confidence:** `92%`
- **Thesis:** Fundamental disconnect between valuation and underlying business performance. Heavy reliance on meme-stock volatility rather than core retail growth. Declining physical game sales pose a structural barrier that management has yet to successfully pivot away from.

---

## 🚀 What I would improve with more time

1. **Live Market Data Integration:** Connect to Polygon.io or Yahoo Finance to feed the LangGraph agent real-time P/E ratios, stock prices, and balance sheet data before it makes a decision.
2. **Streaming Responses:** Use Server-Sent Events (SSE) to stream the LangGraph nodes to the frontend so the user can watch the agent "think" in real-time.
3. **Portfolio Management:** Allow users to save "INVEST" verdicts to a mock portfolio and track simulated performance over time.

---

## 🤖 Built with LLM Pair Programming (Bonus)

This entire project was mandated to be built using an AI/LLM pair programming approach. I utilized an advanced AI coding assistant to bootstrap the architecture, debug complex LangGraph state issues, and iterate on the premium UI design.

**Thought process & Approach:**
- Used AI to rapidly prototype the Express backend and MongoDB schemas.
- Collaborated with the AI to refine the LangGraph prompts to ensure consistent JSON outputs.
- Leveraged the AI to debug tricky Google OAuth `origin_mismatch` errors and API key formatting issues.

> *Note: The full LLM chat session transcript/logs detailing the pair-programming journey are available in the repository history, providing deep insight into the iterative problem-solving approach.*

---

## ⚠️ Disclaimer

This application generates AI-powered investment analysis for educational and demonstration purposes only. It is **not financial advice**. Always conduct your own research before making investment decisions.
