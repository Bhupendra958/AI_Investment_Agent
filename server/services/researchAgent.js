const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { StateGraph, START, END, Annotation } = require("@langchain/langgraph");

const ResearchState = Annotation.Root({
  company: Annotation,
  overview: Annotation,
  financials: Annotation,
  risks: Annotation,
  decision: Annotation,
  confidence: Annotation,
  reason: Annotation,
  summary: Annotation,
  factors: Annotation,
});

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.code = "GEMINI_API_KEY_INVALID";
    throw error;
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey,
    temperature: 0.3,
  });
}

async function invokeModel(prompt) {
  const model = getModel();
  try {
    const response = await model.invoke(prompt);
    return typeof response.content === "string"
      ? response.content
      : response.content.map((part) => part.text || "").join("");
  } catch (err) {
    // Normalise rate-limit errors so the route handler can detect them
    if (
      err.status === 429 ||
      err.statusText === "Too Many Requests" ||
      (err.name && err.name.includes("RateLimitQuotaExhausted")) ||
      (err.message && err.message.includes("429"))
    ) {
      const rateLimitErr = new Error(
        "Gemini API quota exceeded. Please wait a moment and try again, or use an API key with a higher quota."
      );
      rateLimitErr.status = 429;
      rateLimitErr.code = "RATE_LIMIT";
      throw rateLimitErr;
    }
    throw err;
  }
}

async function gatherOverview(state) {
  const overview = await invokeModel(`
You are a senior equity research analyst.

Research the company "${state.company}" and write a concise overview covering:
- Business model and core products/services
- Market position and competitive landscape
- Recent news or strategic developments
- Growth outlook

Do not invent facts. If information is uncertain, say so briefly.
Keep the response under 200 words.
`);

  return { overview: overview.trim() };
}

async function analyzeFinancials(state) {
  const financials = await invokeModel(`
You are a financial analyst evaluating "${state.company}".

Company overview:
${state.overview || "No overview provided yet. Use cautious, generally known public information and state uncertainty when needed."}

Analyze financial health and performance. Cover:
- Revenue trends and profitability
- Valuation considerations (P/E, market cap if public)
- Balance sheet strength
- Growth metrics and margins

Do not invent specific figures. If current figures are unknown, discuss directionally and say what should be verified.
Keep the response under 200 words.
`);

  return { financials: financials.trim() };
}

async function assessRisks(state) {
  const risks = await invokeModel(`
You are a risk analyst evaluating "${state.company}".

Company overview:
${state.overview || "No overview provided yet. Use cautious, generally known public information and state uncertainty when needed."}

Financial analysis:
${state.financials || "No financial analysis provided yet. Avoid unsupported claims."}

Identify key investment risks and opportunities:
- Competitive and market risks
- Regulatory or macroeconomic risks
- Management and execution risks
- Upside catalysts

Do not invent facts. If information is uncertain, say so briefly.
Keep the response under 200 words.
`);

  return { risks: risks.trim() };
}

async function makeDecision(state) {
  const raw = await invokeModel(`
You are an expert investment committee member.

Company: ${state.company}

Overview:
${state.overview}

Financial Analysis:
${state.financials}

Risk Assessment:
${state.risks}

Based on all research above, make a final investment recommendation.

Return ONLY valid JSON with this exact structure:
{
  "company": "${state.company}",
  "decision": "INVEST",
  "confidence": 85,
  "reason": "Detailed reasoning for the decision in 2-3 sentences",
  "summary": "One paragraph company summary for an investor",
  "factors": ["factor 1", "factor 2", "factor 3", "factor 4", "factor 5"]
}

Rules:
- decision must be exactly "INVEST" or "PASS"
- confidence must be a number from 0 to 100
- factors must contain exactly 5 concise bullet points
`);

  const text = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  const result = JSON.parse(text);

  if (
    !result.company ||
    !["INVEST", "PASS"].includes(result.decision) ||
    typeof result.confidence !== "number" ||
    !result.reason ||
    !result.summary ||
    !Array.isArray(result.factors)
  ) {
    throw new Error("AI returned an invalid analysis structure");
  }

  return {
    decision: result.decision,
    confidence: Math.min(100, Math.max(0, Math.round(result.confidence))),
    reason: result.reason,
    summary: result.summary,
    factors: result.factors.slice(0, 5),
  };
}

const workflow = new StateGraph(ResearchState)
  .addNode("gatherOverview", gatherOverview)
  .addNode("analyzeFinancials", analyzeFinancials)
  .addNode("assessRisks", assessRisks)
  .addNode("makeDecision", makeDecision)
  .addEdge(START, "gatherOverview")
  .addEdge("gatherOverview", "analyzeFinancials")
  .addEdge("analyzeFinancials", "assessRisks")
  .addEdge("assessRisks", "makeDecision")
  .addEdge("makeDecision", END);

const researchGraph = workflow.compile();

async function analyzeCompany(company) {
  const startTime = Date.now();

  const finalState = await researchGraph.invoke({
    company,
    overview: "",
    financials: "",
    risks: "",
    decision: "",
    confidence: 0,
    reason: "",
    summary: "",
    factors: [],
  });

  return {
    company: finalState.company,
    decision: finalState.decision,
    confidence: finalState.confidence,
    reason: finalState.reason,
    summary: finalState.summary,
    factors: finalState.factors,
    searchTime: Date.now() - startTime,
    modelUsed: "gemini-1.5-flash (LangGraph)",
  };
}

module.exports = analyzeCompany;
