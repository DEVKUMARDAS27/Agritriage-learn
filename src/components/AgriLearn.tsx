import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, RefreshCw, BookOpen, ChevronRight, Award, Loader2, Info, Sprout } from "lucide-react";
import { DIFFICULTY_LEVELS, QUIZ_TOPICS } from "../constants/agriData";
import { generateQuiz, evaluatePerformance, QuizQuestion } from "../services/gemini";
import Markdown from "react-markdown";

type QuizState = "SETUP" | "LOADING" | "QUIZ" | "RESULTS" | "EVALUATION";

export default function AgriLearn() {
  const [state, setState] = useState<QuizState>("SETUP");
  const [topic, setTopic] = useState(QUIZ_TOPICS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[0]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [evaluation, setEvaluation] = useState("");

  const startQuiz = async () => {
    setState("LOADING");
    const data = await generateQuiz(topic, difficulty);
    setQuestions(data);
    setCurrentIndex(0);
    setUserAnswers([]);
    setState("QUIZ");
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...userAnswers, index];
    setUserAnswers(newAnswers);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setState("RESULTS");
    }
  };

  const getEvaluation = async () => {
    setState("LOADING");
    const results = questions.map((q, i) => ({
      question: q.question,
      isCorrect: userAnswers[i] === q.correctAnswer,
      userAnswer: q.options[userAnswers[i]],
      correctAnswer: q.options[q.correctAnswer]
    }));
    const feedback = await evaluatePerformance(topic, results);
    setEvaluation(feedback);
    setState("EVALUATION");
  };

  const score = userAnswers.filter((ans, i) => ans === questions[i]?.correctAnswer).length;

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <AnimatePresence mode="wait">
        {state === "SETUP" && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center space-y-8 py-12"
          >
            <div className="text-center space-y-2">
              <h1 className="text-4xl">Knowledge Generator</h1>
              <p className="text-gray-500">Select your focus area and challenge level.</p>
            </div>

            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Topic</label>
                <div className="grid grid-cols-2 gap-2">
                  {QUIZ_TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        topic === t ? "border-[#2D5A27] bg-[#F0F4ED] text-[#2D5A27]" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTY_LEVELS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        difficulty === d ? "border-[#2D5A27] bg-[#F0F4ED] text-[#2D5A27]" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startQuiz}
                className="agri-btn-primary w-full shadow-lg shadow-[#2D5A27]/20 flex items-center justify-center gap-2 group"
              >
                Generate Curriculum <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {state === "LOADING" && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative">
               <Loader2 size={48} className="text-[#2D5A27] animate-spin" />
               <Sprout size={24} className="absolute inset-0 m-auto text-[#89B061]" />
            </div>
            <p className="text-[#2D5A27] font-medium animate-pulse">Gemini is harvesting questions...</p>
          </motion.div>
        )}

        {state === "QUIZ" && questions[currentIndex] && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="flex items-center justify-between">
               <div className="text-sm font-bold uppercase tracking-wider text-[#2D5A27]">
                  {topic} • Question {currentIndex + 1} of {questions.length}
               </div>
               <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden text-[#5A5A40]">
                  <div 
                    className="h-full bg-[#2D5A27] transition-all duration-300" 
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
               </div>
            </div>

            <div className="agri-card p-8 lg:p-12">
               <h2 className="text-2xl lg:text-3xl mb-8 leading-tight">{questions[currentIndex].question}</h2>
               <div className="grid gap-3">
                  {questions[currentIndex].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-5 rounded-xl border-2 border-gray-100 bg-white hover:border-[#2D5A27] hover:bg-[#F0F4ED] transition-all flex items-center gap-4 group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:bg-[#2D5A27] group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-medium text-gray-700">{option}</span>
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {state === "RESULTS" && (
          <motion.div 
            key="results"
            className="flex-1 space-y-8 flex flex-col items-center justify-center text-center py-12"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-[#F0F4ED] flex items-center justify-center">
                <span className="text-4xl font-bold text-[#2D5A27]">{score}/{questions.length}</span>
              </div>
              <Award className="absolute -top-2 -right-2 text-yellow-500" size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl">Session Complete</h2>
              <p className="text-gray-500 max-w-sm">Great effort! Your knowledge profile has been updated with these results.</p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setState("SETUP")} className="agri-btn-secondary flex items-center gap-2">
                <RefreshCw size={18} /> Re-Take Quiz
              </button>
              <button onClick={getEvaluation} className="agri-btn-primary flex items-center gap-2 shadow-lg shadow-[#2D5A27]/20">
                <BookOpen size={18} /> Deep Evaluation
              </button>
            </div>
          </motion.div>
        )}

        {state === "EVALUATION" && (
          <motion.div 
            key="evaluation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
               <button onClick={() => setState("RESULTS")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw size={20} />
               </button>
               <h2 className="text-2xl">Expert Feedback</h2>
            </div>
            <div className="agri-card flex-1 p-8 lg:p-12 overflow-y-auto bg-white border-t-4 border-t-[#2D5A27]">
              <div className="markdown-body prose max-w-none text-gray-700 leading-relaxed prose-headings:font-display prose-headings:text-[#2D5A27]">
                <Markdown>{evaluation}</Markdown>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => setState("SETUP")}
                className="agri-btn-primary"
              >
                Start New Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
