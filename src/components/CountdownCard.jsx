import { useTracker } from "../context/TrackerContext";
import { useState, useEffect } from "react";
import { Palmtree } from "lucide-react";

export default function CountdownCard() {
  const { termConfig } = useTracker();
  const [daysLeft, setDaysLeft] = useState(0);
  const [nextHoliday, setNextHoliday] = useState(null);

  useEffect(() => {
    const today = new Date();
    
    // 1. Calculate absolute days remaining
    const diffTime = termConfig.endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays > 0 ? diffDays : 0);

    // 2. Find the next upcoming holiday
    const upcoming = termConfig.holidays.find(h => h.date > today);
    if (upcoming) {
      // Format the date to look nice (e.g., "May 1")
      const formattedDate = upcoming.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setNextHoliday(`${upcoming.name} (${formattedDate})`);
    }
  }, [termConfig]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg flex justify-between items-center relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl"></div>

      <div>
        <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-1">
          Countdown
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-white">
            {daysLeft}
          </span>
          <span className="text-sm font-medium text-zinc-400">
            days until term ends
          </span>
        </div>
      </div>

      {/* Dynamic Holiday Badge */}
      {nextHoliday && (
        <div className="text-right z-10 flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-1">
            Next Holiday
          </span>
          <span className="flex items-center gap-1 text-xs font-medium bg-red-950/40 text-red-400 border border-red-900/50 px-2 py-1 rounded-md">
            <Palmtree size={14} /> {nextHoliday}
          </span>
        </div>
      )}
    </div>
  );
}