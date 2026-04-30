import { ArrowRight, BookOpen, MessageCircle, Sprout, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-display text-gray-900">Welcome to the Agri Platform</h1>
        <p className="text-gray-500 max-w-2xl">
          Empowering the agricultural community through generative education and intelligent triage. 
          Manage your crops, diagnose diseases, and learn the latest modern practices.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* AgriLearn Card */}
        <div id="agri-learn-cta" className="agri-card p-8 group relative flex flex-col">
          <div className="w-12 h-12 bg-[#F0F4ED] rounded-xl flex items-center justify-center text-[#2D5A27] mb-6 transition-transform group-hover:scale-110">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl mb-2">AgriLearn</h2>
          <p className="text-gray-500 mb-8 flex-1 text-sm">
            Test your knowledge with our AI-powered quiz bot. Dynamically generated multiple-choice 
            questions tailored to your level.
          </p>
          <Link to="/learn" className="agri-btn-primary inline-flex items-center gap-2 self-start py-2 px-4 text-sm">
            Start Learning <ArrowRight size={16} />
          </Link>
        </div>

        {/* Crop Encyclopedia Card */}
        <div id="crop-info-cta" className="agri-card p-8 group relative flex flex-col bg-white">
          <div className="w-12 h-12 bg-[#E1F0FF] rounded-xl flex items-center justify-center text-[#2D519A] mb-6 transition-transform group-hover:scale-110">
            <Sprout size={24} />
          </div>
          <h2 className="text-2xl mb-2">Crop Info</h2>
          <p className="text-gray-500 mb-8 flex-1 text-sm">
            Discover detailed insights about various crops. Get biological data, climate needs, 
            and planting guides instantly.
          </p>
          <Link to="/crops" className="agri-btn-secondary inline-flex items-center gap-2 self-start py-2 px-4 text-sm">
            View Crops <ArrowRight size={16} />
          </Link>
        </div>

        {/* AgriTriage Card */}
        <div id="agri-triage-cta" className="agri-card p-8 group relative flex flex-col">
          <div className="w-12 h-12 bg-[#FFF4E5] rounded-xl flex items-center justify-center text-[#9A6B2D] mb-6 transition-transform group-hover:scale-110">
            <MessageCircle size={24} />
          </div>
          <h2 className="text-2xl mb-2">Support Triage</h2>
          <p className="text-gray-500 mb-8 flex-1 text-sm">
            Expert advice for farming queries. Our system routes questions to specialized agents.
          </p>
          <Link to="/triage" className="agri-btn-secondary inline-flex items-center gap-2 self-start py-2 px-4 text-sm">
            Get Support <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats/Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Farmers", value: "1,200+", icon: Users },
          { label: "Successful Rounds", value: "8,400+", icon: Sprout },
          { label: "Advice Precision", value: "94%", icon: TrendingUp },
          { label: "Agent Response", value: "< 2s", icon: MessageCircle },
        ].map((stat, i) => (
          <div key={i} className="agri-card p-4 flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <stat.icon size={20} className="text-[#2D5A27]" />
            </div>
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
