import { useTracker } from "../context/TrackerContext";
import { Monitor, MapPin } from "lucide-react";

export default function WeekDisplayCard() {
  const { selectedWeek, termConfig, getModalityForWeek, toggleModality } = useTracker();
  
  const currentModality = getModalityForWeek(selectedWeek);
  const isOnline = currentModality === "Online";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
      <p className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-4">
        {termConfig.termName}
      </p>
      
      <h2 className="text-6xl md:text-7xl font-extrabold text-white mb-2">
        Week {selectedWeek}
      </h2>
      
      <p className="text-zinc-400 font-medium mb-6">
        of {termConfig.totalWeeks} weeks
      </p>

      {/* Interactive Interactive Modality Badge */}
      <button 
        onClick={() => toggleModality(selectedWeek)}
        className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOnline 
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" 
            : "bg-red-500 text-white border border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
        }`}
      >
        {isOnline ? <><Monitor size={16} /> Online</> : <><MapPin size={16} /> F2F / In-Person</>}
      </button>
      
      <p className="text-xs text-zinc-500 mt-3 opacity-70">
        Click to toggle modality
      </p>
    </div>
  );
}