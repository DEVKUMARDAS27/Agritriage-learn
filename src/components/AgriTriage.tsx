import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, AlertCircle, Search, Sprout, Bug, ShieldAlert, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { getTriageResponse } from "../services/gemini";

type AgentType = "CROP" | "DISEASE" | "POLICY";

interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: AgentType;
  keywords?: string[];
}

export default function AgriTriage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to AgriTriage. I'm here to assist with your farming challenges. Which area can I help you with today?" }
  ]);
  const [input, setInput] = useState("");
  const [agentType, setAgentType] = useState<AgentType>("CROP");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input, agent: agentType };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getTriageResponse(input, agentType);
      
      // Simulate keyword extraction for visual context
      const keywordRegex = /Keywords:\s*(.*)/i;
      const match = response.match(keywordRegex);
      const keywords = match?.[1]?.split(",").map(k => k.trim()) || [];
      const cleanContent = response.replace(keywordRegex, "").trim();

      const botMessage: Message = { 
        role: "assistant", 
        content: cleanContent, 
        agent: agentType,
        keywords: keywords.slice(0, 3) 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error. Please check your connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const agents = [
    { id: "CROP", label: "Crop Advisor", icon: Sprout, color: "text-[#2D5A27]", bg: "bg-[#F0F4ED]" },
    { id: "DISEASE", label: "Disease Expert", icon: Bug, color: "text-[#9A2D2D]", bg: "bg-[#F4EDED]" },
    { id: "POLICY", label: "Policy Advisor", icon: ShieldAlert, color: "text-[#2D519A]", bg: "bg-[#EDF0F4]" },
  ];

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Support Triage</h1>
          <p className="text-sm text-gray-500">Expert guidance routed through specialized multi-agent AI.</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setAgentType(agent.id as AgentType)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                ${agentType === agent.id 
                  ? `${agent.bg} ${agent.color} shadow-sm` 
                  : "text-gray-400 hover:text-gray-600"}
              `}
            >
              <agent.icon size={14} />
              {agent.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="agri-card flex-1 flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAF8]">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 ${
                msg.role === "assistant" ? "bg-white text-[#2D5A27]" : "bg-[#2D5A27] text-white"
              }`}>
                {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === "user" ? "items-end" : ""}`}>
                <div className={`
                  p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === "assistant" 
                    ? "bg-white shadow-sm border border-[#E5E5E0] text-gray-800" 
                    : "bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20"}
                `}>
                  {msg.content}
                </div>
                
                {msg.role === "assistant" && msg.keywords && msg.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.keywords.map((kw, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D1E0C9] rounded-full text-[10px] font-bold text-[#2D5A27] uppercase tracking-wider">
                         <ImageIcon size={10} />
                         {kw} Reference
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 animate-pulse">
                 <Sparkles size={20} className="text-[#2D5A27]" />
              </div>
              <div className="bg-white border border-[#E5E5E0] p-4 rounded-2xl flex items-center gap-3">
                 <Loader2 size={16} className="animate-spin text-[#2D5A27]" />
                 <span className="text-xs text-gray-400">Consulting {agentType} database...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#E5E5E0] flex gap-3">
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask the ${agentType.toLowerCase()} advisor...`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20 transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="agri-btn-primary p-3 rounded-xl flex items-center justify-center shrink-0"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Warning/Info Footer */}
      <div className="flex items-start gap-3 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 text-[11px] text-yellow-800 leading-normal">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> AgriTriage advice is AI-generated and should be verified with local agricultural extensions 
          before large-scale implementation. Always perform a patch test before applying new fertilizers or treatments.
        </p>
      </div>
    </div>
  );
}
