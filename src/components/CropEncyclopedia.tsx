import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sprout, Loader2, BookOpen, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { CROPS_LIST } from "../constants/agriData";
import { getCropDetails } from "../services/gemini";
import Markdown from "react-markdown";

export default function CropEncyclopedia() {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDetails = async (crop: string) => {
    setSelectedCrop(crop);
    setDetails("");
    setIsLoading(true);
    try {
      const info = await getCropDetails(crop);
      setDetails(info);
    } catch (error) {
      console.error("Failed to fetch crop details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCrops = CROPS_LIST.filter(crop => 
    crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl">Crop Encyclopedia</h1>
          <p className="text-gray-500">Deep biological and management data for major agricultural crops.</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input
             type="text"
             placeholder="Search crops..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/20 transition-all"
           />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_2.5fr] gap-8 items-start">
        {/* Sidebar: Crop Selection */}
        <div className="agri-card p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2">Catalog</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {filteredCrops.map((crop) => (
              <button
                key={crop}
                onClick={() => fetchDetails(crop)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
                  ${selectedCrop === crop 
                    ? "bg-[#2D5A27] text-white shadow-md shadow-[#2D5A27]/20" 
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                `}
              >
                <div className={`w-2 h-2 rounded-full ${selectedCrop === crop ? "bg-white" : "bg-[#89B061]"}`} />
                {crop}
                <ChevronRight size={14} className="ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedCrop ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 agri-card flex flex-col items-center justify-center p-12 text-center bg-[#FBFBF9]/50 border-dashed border-2"
              >
                <div className="w-16 h-16 bg-[#F0F4ED] rounded-2xl flex items-center justify-center text-[#2D5A27] mb-4">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl mb-2">Select a crop to explore</h3>
                <p className="text-sm text-gray-400 max-w-xs">
                  Choose a crop from the catalog to see comprehensive growth guides and management strategies.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col gap-6"
              >
                <div className="agri-card overflow-hidden bg-white">
                  <div className="h-40 bg-[#2D5A27] relative overflow-hidden flex items-center px-12">
                     <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
                     </div>
                     <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                           <Sprout size={32} />
                        </div>
                        <div className="text-white">
                           <h2 className="text-3xl mb-1">{selectedCrop} Profile</h2>
                           <p className="text-white/60 text-sm font-medium">Detailed Growth & Management Guide</p>
                        </div>
                     </div>
                     <Sparkles className="absolute bottom-6 right-8 text-white/30" size={48} />
                  </div>

                  <div className="p-8 lg:p-12 relative min-h-[300px]">
                    {isLoading ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-4">
                         <Loader2 className="animate-spin text-[#2D5A27]" size={32} />
                         <p className="text-sm text-[#2D5A27] font-medium tracking-wide">Syncing Biological Data...</p>
                      </div>
                    ) : null}

                    <div className="markdown-body prose max-w-none prose-headings:font-display prose-headings:text-[#2D5A27] text-gray-700 leading-relaxed">
                      <Markdown>{details}</Markdown>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-normal">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-blue-400" />
                  <p>
                    <strong>Database Note:</strong> These details are dynamically generated based on standard agricultural practices. 
                    Factors like local soil health and micro-climates may require slight adjustments to these recommendations.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
