import { useTracker } from "../context/TrackerContext";
import { useEffect, useState, useRef } from "react";
// Import Lucide Icons
import { Calendar, ChevronRight, CheckCircle2, Palmtree, Circle } from "lucide-react"; 

export default function ProgressBar() {
  const { selectedWeek, setSelectedWeek, termConfig, calendarEvents } = useTracker();
  const totalWeeks = termConfig.totalWeeks;

  const [currentTermDay, setCurrentTermDay] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState(null); // Tracks which week's tooltip is open
  const containerRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(termConfig.startDate);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setCurrentTermDay(Math.max(0, Math.min(diffDays, (totalWeeks * 7) - 1)));
  }, [termConfig.startDate, totalWeeks]);

  // Close tooltip when clicking completely outside the progress bar component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getWeekDates = (weekNum) => {
    const start = new Date(termConfig.startDate);
    start.setDate(start.getDate() + (weekNum - 1) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // Helper to extract all events that fall within a specific week
  const getEventsForWeek = (weekNum) => {
    const start = new Date(termConfig.startDate);
    start.setDate(start.getDate() + (weekNum - 1) * 7);
    let weekEvents = [];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toDateString();
      if (calendarEvents && calendarEvents[dateStr]) {
        weekEvents.push(...calendarEvents[dateStr].map(ev => ({ 
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), 
          text: ev.text,
          completed: ev.completed // Pass the new completed flag
        })));
      }
    }
    return weekEvents;
  };

  const jumpToWeek = (weekNum) => {
    setSelectedWeek(weekNum);
    setActiveTooltip(null);
  };

  return (
    <div ref={containerRef} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg flex flex-col justify-center animate-in slide-in-from-bottom-4 duration-500 fade-in">
      
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Term Progress</h3>
        <span className="text-sm font-bold text-zinc-300">W{selectedWeek} / {totalWeeks}</span>
      </div>

      <div className="flex gap-1.5 sm:gap-2 h-8">
        {[...Array(totalWeeks)].map((_, wIndex) => {
          const weekNum = wIndex + 1;
          const isPlanningWeek = weekNum === selectedWeek;
          
          const weekStartDay = wIndex * 7;
          const weekEndDay = weekStartDay + 6;
          let fillPercent = 0;

          if (currentTermDay > weekEndDay) fillPercent = 100;
          else if (currentTermDay >= weekStartDay && currentTermDay <= weekEndDay) {
            fillPercent = (((currentTermDay - weekStartDay) + 1) / 7) * 100;
          }

          const isCurrentRealWeek = currentTermDay >= weekStartDay && currentTermDay <= weekEndDay;
          const isOpen = activeTooltip === weekNum;
          const weekEvents = getEventsForWeek(weekNum);

          // Dynamic positioning for tooltips (edge detection)
          let tooltipAlignment = "left-0"; 
          let pointerAlignment = "left-6";
          if (wIndex < 2) {
            tooltipAlignment = "left-0";
            pointerAlignment = "left-6";
          } else if (wIndex > 11) {
            tooltipAlignment = "right-0";
            pointerAlignment = "right-4";
          }

          return (
            <div key={weekNum} className="relative flex-1">
              {/* The Week Block */}
              <div
                onClick={() => setActiveTooltip(isOpen ? null : weekNum)}
                className={`w-full h-full rounded-md overflow-hidden cursor-pointer transition-all duration-300 bg-zinc-950 ${
                  isPlanningWeek 
                    ? "ring-2 ring-red-500 scale-y-110 shadow-lg z-10" 
                    : "ring-1 ring-zinc-800 hover:ring-zinc-600"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-out ${
                    isCurrentRealWeek ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "bg-red-900/80"
                  }`}
                  style={{ width: `${fillPercent}%` }}
                />
                {/* Visual pulse for the current week */}
                {isCurrentRealWeek && <div className="absolute inset-0 bg-white/10 animate-pulse mix-blend-overlay" />}
              </div>

              {/* Tooltip Modal */}
              {isOpen && (
                <div className={`absolute bottom-full mb-3 w-64 sm:w-72 bg-zinc-800 border border-zinc-700 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-200 ${tooltipAlignment}`}>
                  
                  {/* The Arrow Pointer */}
                  <div className={`absolute -bottom-2 w-4 h-4 bg-zinc-800 border-b border-r border-zinc-700 transform rotate-45 ${pointerAlignment}`}></div>

                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-zinc-700 pb-3 mb-3">
                    <div>
                      <h3 className="font-bold text-white tracking-tight flex items-center gap-2">
                        Week {weekNum} 
                        {isCurrentRealWeek && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                      </h3>
                      <p className="text-xs font-medium text-zinc-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} /> {getWeekDates(weekNum)}
                      </p>
                    </div>
                  </div>

                  {/* The New Day Counter (LED Dots) */}
                  <div className="mb-4 bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-3 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Day Counter</h4>
                      
                      {(() => {
                        const wStart = (weekNum - 1) * 7;
                        const wEnd = wStart + 6;
                        let daysDone = 0;
                        if (currentTermDay > wEnd) daysDone = 7;
                        else if (currentTermDay >= wStart && currentTermDay <= wEnd) daysDone = currentTermDay - wStart + 1;
                        return <span className="text-[10px] font-bold text-red-400">{daysDone} / 7 Days Complete</span>;
                      })()}
                    </div>
                    
                    <WeekDayCounter weekNum={weekNum} termConfig={termConfig} currentTermDay={currentTermDay} />
                  </div>

                  {/* Scheduled Events Section */}
                  <div className="mb-4">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Scheduled Events</h4>
                    {weekEvents.length > 0 ? (
                      <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {weekEvents.map((ev, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-start gap-2 bg-zinc-900/50 p-2 rounded-md border border-zinc-700/50">
                            <div className="mt-0.5 shrink-0">
                              {ev.completed ? <CheckCircle2 size={12} className="text-red-500" /> : <Circle size={12} className="text-zinc-600" />}
                            </div>
                            <span className="font-bold text-zinc-500 w-8 shrink-0">{ev.dayName}</span>
                            <span className={`transition-all ${ev.completed ? "text-zinc-600 line-through" : ""}`}>{ev.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-zinc-500 italic bg-zinc-900/30 p-2 rounded-md flex items-center gap-2">
                        <CheckCircle2 size={14} className="opacity-50" /> No scheduled tasks
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {selectedWeek !== weekNum ? (
                    <button 
                      onClick={() => jumpToWeek(weekNum)} 
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-950 text-white border border-zinc-700 rounded-lg transition-colors"
                    >
                      Plan this Week <ChevronRight size={14} />
                    </button>
                  ) : (
                    <div className="w-full text-center py-2 text-xs font-bold text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                      Currently Planning
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] font-bold text-zinc-500 mt-4 uppercase tracking-wider">
        <span>Start</span>
        <span className="ml-4">~W7 Mid</span>
        <span className="text-red-500/70">W13 Finals</span>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Segmented Day Counter --- //

function WeekDayCounter({ weekNum, termConfig, currentTermDay }) {
  const wStartDay = (weekNum - 1) * 7;
  
  return (
    <div className="flex gap-1.5 w-full">
      {[...Array(7)].map((_, i) => {
        const globalDayIndex = wStartDay + i;
        const isPast = globalDayIndex < currentTermDay;
        const isToday = globalDayIndex === currentTermDay;
        
        // Calculate the actual date for this slot
        const thisDate = new Date(termConfig.startDate);
        thisDate.setDate(thisDate.getDate() + globalDayIndex);
        
        // Check for holidays to make the tooltip smarter
        const isHoliday = termConfig.holidays.some(h => h.date.toDateString() === thisDate.toDateString());
        const dayName = thisDate.toLocaleDateString('en-US', { weekday: 'short' });
        const formalDate = thisDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div
            key={i}
            // Use a smart tooltip that includes the date, day, and status
            title={`${dayName}, ${formalDate} ${isToday ? "(Today)" : isPast ? "(Past)" : isHoliday ? "(Holiday)" : ""}`}
            className={`flex-1 h-2 rounded-full transition-all duration-300 relative ${
              isToday 
                ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" 
                : isPast 
                  ? "bg-red-900/80 border border-red-900" 
                  : isHoliday
                    ? "bg-amber-950/40 border border-amber-900/50" // Subtly mark holidays
                    : "bg-zinc-800 border border-zinc-700/50" // Future/Not Done
            }`}
          >
            {/* Pulsing indicator specifically for "today" within the tooltip */}
            {isToday && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse opacity-60" />
            )}
            
            {/* Holiday indicator icon, subtle */}
            {isHoliday && (
              <Palmtree size={10} className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-500 opacity-60" />
            )}
          </div>
        );
      })}
    </div>
  );
}