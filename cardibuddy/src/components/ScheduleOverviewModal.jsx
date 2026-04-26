import React from "react";
import { X } from "lucide-react";
import { useTracker } from "../context/TrackerContext";

export default function ScheduleOverviewModal({ onClose }) {
  const { classes } = useTracker();
  
  const START_HOUR = 7; 
  const PERIODS = [
    "07:00 AM", "08:10 AM", "09:20 AM", "10:30 AM", "11:40 AM", 
    "12:50 PM", "02:00 PM", "03:10 PM", "04:20 PM", "05:30 PM", 
    "06:40 PM", "07:50 PM", "09:00 PM"
  ];

  const timeBlocks = [];
  for (let i = 0; i < 12; i++) {
    timeBlocks.push({ start: PERIODS[i], end: PERIODS[i+1] });
  }

  const ORDERED_DAYS = [
    { name: "Mon", index: 1 }, { name: "Tue", index: 2 }, 
    { name: "Wed", index: 3 }, { name: "Thu", index: 4 }, 
    { name: "Fri", index: 5 }, { name: "Sat", index: 6 }, 
    { name: "Sun", index: 0 }
  ];

  // We bring back our native color map for the blocks
  const colorMap = {
    blue: "bg-blue-500/20 border-blue-500 text-blue-300", emerald: "bg-emerald-500/20 border-emerald-500 text-emerald-300",
    rose: "bg-rose-500/20 border-rose-500 text-rose-300", amber: "bg-amber-500/20 border-amber-500 text-amber-300",
    purple: "bg-purple-500/20 border-purple-500 text-purple-300", zinc: "bg-zinc-500/20 border-zinc-500 text-zinc-300"
  };

  const getMinutesFromStart = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours * 60 + minutes) - (START_HOUR * 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-6xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <h3 className="font-extrabold text-xl text-white tracking-tight">Week at a Glance</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-zinc-950/50">
          
          {/* NATIVE THEME GRID ENGINE */}
          {/* bg-zinc-800 draws the subtle dark grid borders */}
          <div className="min-w-[800px] grid grid-cols-[100px_repeat(7,1fr)] bg-zinc-800 gap-[1px] border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
            
            {/* Headers */}
            <div className="bg-zinc-900 text-zinc-500 font-bold text-center py-3 px-1 text-xs uppercase tracking-widest">Time</div>
            {ORDERED_DAYS.map(d => (
              <div key={d.name} className="bg-zinc-900 text-zinc-400 font-bold text-center py-3 px-1 text-xs uppercase tracking-widest">
                {d.name}
              </div>
            ))}

            {/* Background Empty Cells */}
            {timeBlocks.map((time, rIndex) => (
              <React.Fragment key={`row-${rIndex}`}>
                {/* Time Sidebar Column */}
                <div className="bg-zinc-950 flex flex-col items-center justify-center py-3 text-[10px] text-zinc-500 font-medium" style={{ gridRow: rIndex + 2, gridColumn: 1 }}>
                  <span>{time.start}</span>
                  <span className="text-zinc-700">-</span>
                  <span>{time.end}</span>
                </div>
                {/* Empty Day Columns */}
                {ORDERED_DAYS.map((d, cIndex) => (
                  <div key={`cell-${rIndex}-${cIndex}`} className="bg-zinc-950/80" style={{ gridRow: rIndex + 2, gridColumn: cIndex + 2 }}></div>
                ))}
              </React.Fragment>
            ))}

            {/* Foreground Cells: The Classes */}
            {classes.flatMap(cls => {
              const startMins = getMinutesFromStart(cls.startTime);
              const durationMins = getMinutesFromStart(cls.endTime) - startMins;
              
              const periodIndex = Math.round(startMins / 70);
              const span = Math.max(1, Math.round(durationMins / 70));

              return cls.days.map(dayIndex => {
                const colIndex = ORDERED_DAYS.findIndex(d => d.index === dayIndex);
                if (colIndex === -1) return null;

                return (
                  <div
                    key={`${cls.id}-${dayIndex}`}
                    // bg-zinc-950 ensures transparency from the colorMap doesn't reveal the gridlines underneath
                    className="bg-zinc-950 p-1 relative z-10"
                    style={{
                      gridRow: `${periodIndex + 2} / span ${span}`, 
                      gridColumn: colIndex + 2,
                    }}
                  >
                    {/* The styled block, completely matching the app's aesthetic */}
                    <div className={`w-full h-full rounded-md border flex flex-col items-center justify-center p-2 text-center shadow-lg ${colorMap[cls.color] || colorMap.zinc}`}>
                      <span className="text-xs sm:text-sm font-extrabold text-white leading-tight">{cls.code}</span>
                      <span className="text-[10px] font-medium opacity-90 mt-1 leading-tight">{cls.title.replace("Section: ", "").trim()}</span>
                      <span className="text-[9px] font-bold mt-auto bg-black/40 px-2 py-0.5 rounded text-white">{cls.room}</span>
                    </div>
                  </div>
                );
              });
            })}

          </div>
        </div>
      </div>
    </div>
  );
}