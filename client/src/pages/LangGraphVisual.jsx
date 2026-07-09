import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaNetworkWired, FaInfoCircle, FaCode, FaPlay } from "react-icons/fa";

function LangGraphVisual() {
  const [selectedNode, setSelectedNode] = useState("gatherOverview");

  const nodes = {
    START: {
      title: "START",
      role: "Graph Entry Point",
      description: "Initializes the LangGraph state channel with the target company's name and empty research objects.",
      inputs: "company: string",
      outputs: "company: string, overview: '', financials: '', risks: '', decision: '', confidence: 0, reason: '', summary: '', factors: []",
      prompt: "No LLM query at this stage. Pure initialization point.",
      exampleOutput: "{ company: 'NVIDIA' }",
    },
    gatherOverview: {
      title: "1. gatherOverview (Node)",
      role: "Senior Equity Research Analyst",
      description: "Researches general business operations, core products/services, market share positioning, and recent announcements.",
      inputs: "company",
      outputs: "overview",
      prompt: `Research the company "{company}" and write a concise overview covering:\n- Business model and core products/services\n- Market position and competitive landscape\n- Recent news or strategic developments\n- Growth outlook.`,
      exampleOutput: "NVIDIA Corporation is the pioneer of GPU-accelerated computing, specializing in high-performance chips for gaming, professional visualization, data centers, and automotive markets...",
    },
    analyzeFinancials: {
      title: "2. analyzeFinancials (Node)",
      role: "Lead Financial Analyst",
      description: "Ingests the generated overview. Evaluates financial health, margins, revenue momentum, and historical valuation indicators.",
      inputs: "overview",
      outputs: "financials",
      prompt: `Company overview: {overview}. \nAnalyze financial health and performance. Cover:\n- Revenue trends and profitability\n- Valuation considerations (P/E, market cap)\n- Balance sheet strength\n- Growth metrics and margins.`,
      exampleOutput: "NVIDIA reports exceptional financial performance with Q3 revenue up 94% YoY. Gross margins exceed 75% driven by server demand...",
    },
    assessRisks: {
      title: "3. assessRisks (Node)",
      role: "Risk Control Officer",
      description: "Ingests overview and financial summaries. Performs threat mapping including competition, market saturations, macrotrends, and regulatory blockages.",
      inputs: "overview, financials",
      outputs: "risks",
      prompt: `Company overview: {overview}. Financial analysis: {financials}.\nIdentify key investment risks and opportunities:\n- Competitive and market risks\n- Regulatory or macroeconomic risks\n- Management and execution risks\n- Upside catalysts.`,
      exampleOutput: "Key risks include AMD and custom cloud hyperscaler silicon chip competition, geopolitical restrictions limiting sales in key Asian markets...",
    },
    makeDecision: {
      title: "4. makeDecision (Node)",
      role: "Investment Committee Board",
      description: "Synthesizes data from overview, financials, and risks. Determines the verdict, confidence score, summary, and bullet points. Returns structured JSON.",
      inputs: "overview, financials, risks",
      outputs: "decision, confidence, reason, summary, factors",
      prompt: `Based on all research, make a final recommendation. Return ONLY valid JSON:\n{\n  "company": "{company}",\n  "decision": "INVEST" | "PASS",\n  "confidence": number,\n  "reason": "2-3 sentences",\n  "summary": "one paragraph",\n  "factors": ["f1", "f2", "f3", "f4", "f5"]\n}`,
      exampleOutput: `{\n  "company": "NVIDIA",\n  "decision": "INVEST",\n  "confidence": 90,\n  "reason": "Dominant compute monopoly in AI training hardware provides deep economic moat.",\n  "factors": ["90% data center GPU market share", "Strong margins >75%", "Intact long-term AI hardware demand"]\n}`,
    },
    END: {
      title: "END",
      role: "Graph Exit Point",
      description: "Concludes workflow execution, compiling state channels into final output variables and writing logs into MongoDB.",
      inputs: "All aggregated state variables",
      outputs: "Final research response document",
      prompt: "No LLM query. Concludes state cycle.",
      exampleOutput: "Research data successfully saved.",
    },
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Navbar />

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              <FaNetworkWired className="text-blue-500" />
              LangGraph Flow Visualization
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Visual pipeline representing the 4-node LangGraph state machine orchestrating Gemini AI research.
            </p>
          </div>
        </div>

        {/* Visual Graph Area */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 mt-8">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-4">Pipeline Execution Path</h3>
          <div className="relative w-full flex flex-col items-center justify-center p-8 bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-850 overflow-x-auto">

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10 w-full justify-center">

              {/* START */}
              <button
                onClick={() => setSelectedNode("START")}
                className={`px-4 py-3 rounded-xl border text-xs font-black transition-all ${
                  selectedNode === "START"
                    ? "bg-slate-700 text-white border-slate-500 shadow-lg scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                START
              </button>

              <span className="text-slate-400 dark:text-slate-600 font-bold">➔</span>

              {/* Node 1 */}
              <button
                onClick={() => setSelectedNode("gatherOverview")}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-extrabold transition-all text-left ${
                  selectedNode === "gatherOverview"
                    ? "bg-blue-600 text-white border-blue-400 shadow-xl scale-105"
                    : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Node 1</div>
                Overview Gather
              </button>

              <span className="text-slate-400 dark:text-slate-600 font-bold">➔</span>

              {/* Node 2 */}
              <button
                onClick={() => setSelectedNode("analyzeFinancials")}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-extrabold transition-all text-left ${
                  selectedNode === "analyzeFinancials"
                    ? "bg-blue-600 text-white border-blue-400 shadow-xl scale-105"
                    : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Node 2</div>
                Analyze Financials
              </button>

              <span className="text-slate-400 dark:text-slate-600 font-bold">➔</span>

              {/* Node 3 */}
              <button
                onClick={() => setSelectedNode("assessRisks")}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-extrabold transition-all text-left ${
                  selectedNode === "assessRisks"
                    ? "bg-blue-600 text-white border-blue-400 shadow-xl scale-105"
                    : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Node 3</div>
                Assess Risks
              </button>

              <span className="text-slate-400 dark:text-slate-600 font-bold">➔</span>

              {/* Node 4 */}
              <button
                onClick={() => setSelectedNode("makeDecision")}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-extrabold transition-all text-left ${
                  selectedNode === "makeDecision"
                    ? "bg-amber-600 text-white border-amber-400 shadow-xl scale-105"
                    : "bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-1">Node 4</div>
                Make Decision
              </button>

              <span className="text-slate-400 dark:text-slate-600 font-bold">➔</span>

              {/* END */}
              <button
                onClick={() => setSelectedNode("END")}
                className={`px-4 py-3 rounded-xl border text-xs font-black transition-all ${
                  selectedNode === "END"
                    ? "bg-slate-700 text-white border-slate-500 shadow-lg scale-105"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                END
              </button>

            </div>
          </div>
        </div>

        {/* Node Information Panel */}
        {selectedNode && (
          <div className="grid lg:grid-cols-3 gap-6 mt-6">

            {/* Left: Summary */}
            <div className="lg:col-span-1 rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 space-y-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Selected Step</span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{nodes[selectedNode].title}</h4>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">State-Channel Role</span>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold block">{nodes[selectedNode].role}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">Description</span>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{nodes[selectedNode].description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase block">State Inputs</span>
                  <code className="text-slate-500 dark:text-slate-400 text-[10px] block mt-1">{nodes[selectedNode].inputs}</code>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase block">State Outputs</span>
                  <code className="text-slate-500 dark:text-slate-400 text-[10px] block mt-1">{nodes[selectedNode].outputs}</code>
                </div>
              </div>
            </div>

            {/* Right: Prompt & Output */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-lg p-6 flex flex-col justify-between space-y-6">

              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FaCode className="text-blue-500" />
                  Node System Prompt
                </span>
                <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-y-auto max-h-[130px]">
                  <pre className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                    {nodes[selectedNode].prompt}
                  </pre>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FaPlay className="text-emerald-500 text-[10px]" />
                  State Output Channel Object
                </span>
                <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-y-auto max-h-[130px]">
                  <pre className="text-emerald-600 dark:text-emerald-400 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                    {nodes[selectedNode].exampleOutput}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Info note */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/70 dark:bg-slate-800/20 dark:border-slate-800/80 shadow p-6 mt-6 flex items-start gap-4">
          <FaInfoCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm">CSE Student Concept Note</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1">
              This pipeline is implemented as a <strong>StateGraph</strong> using the <strong>LangGraph.js</strong> package. Each node acts as an LLM agent with restricted roles, passing output variables down to update state channels. Finally, <code>makeDecision</code> parses outputs and formats final investment reports saved to the database.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LangGraphVisual;
