import { Brackets as _Brackets, BookOpen, MessageSquare, Sprout, LayoutDashboard, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "AgriLearn", path: "/learn", icon: BookOpen },
    { name: "Crop Info", path: "/crops", icon: Sprout },
    { name: "AgriTriage", path: "/triage", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-[#FBFBF9]">
      {/* Mobile Sidebar Toggle */}
      <button 
        id="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E5E5E0] transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-[#2D5A27] rounded-xl flex items-center justify-center text-white">
              <Sprout size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold leading-tight">AgriTriage</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">& Learn</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                    ${isActive 
                      ? "bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                  `}
                >
                  <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 bg-[#F0F4ED] rounded-2xl border border-[#D1E0C9]">
            <p className="text-xs font-bold text-[#2D5A27] uppercase tracking-wide mb-1">Knowledge Guard</p>
            <p className="text-[10px] text-[#4A6B3D] leading-relaxed">
              Your agricultural data is processed securely with Gemini AI.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative">
        <header className="h-16 border-b border-[#E5E5E0] bg-white/80 backdrop-blur-sm sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="hidden lg:block text-xs font-medium text-gray-400">
            Current Session: <span className="text-gray-900 uppercase">Active Agent</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-[#E5E5E0] overflow-hidden border border-white">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Agri" alt="User" />
             </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
