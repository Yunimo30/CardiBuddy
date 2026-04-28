import { useState } from "react";
import { useTracker } from "../context/TrackerContext";
import { LayoutGrid, List, Plus, ClipboardPaste, Clock, MapPin, Monitor, CalendarSync, ChevronRight, Shrink, Expand, Maximize } from "lucide-react";
import AddClassModal from "../components/AddClassModal";
import ClassDetailsModal from "../components/ClassDetailsModal"; 
import ImportScheduleModal from "../components/ImportScheduleModal";
import ScheduleOverviewModal from "../components/ScheduleOverviewModal";

export default function Schedule() {
  const { classes } = useTracker();
  const [viewMode, setViewMode] = useState("grid"); 
  const [isCompact, setIsCompact] = useState(false);
  const [activeModal, setActiveModal] = useState("none"); 
  const [selectedClass, setSelectedClass] = useState(null); 

  const handleAddClick = () => { setSelectedClass(null); setActiveModal("add"); };
  const handleBlockClick = (cls) => { setSelectedClass(cls); setActiveModal("view"); };
  const handleEditTrigger = () => { setActiveModal("edit"); };
  const closeModal = () => { setActiveModal("none"); setSelectedClass(null); };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-3 sm:space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-4 px-1 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Class Schedule</h1>
          <p className="text-[10px] sm:text-sm font-medium text-zinc-400 mt-0.5 sm:mt-1">Manage your weekly timetable</p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 shrink-0">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode("stack")} className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === "stack" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><List size={16} /></button>
          </div>

          {viewMode === "grid" && (
            <button onClick={() => setIsCompact(!isCompact)} className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 p-2 sm:p-2.5 rounded-lg transition-colors border border-zinc-800 shrink-0">
              {isCompact ? <Expand size={14} /> : <Shrink size={14} />}
            </button>
          )}

          <button onClick={() => setActiveModal("import")} className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white p-2 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm border border-zinc-700 shrink-0">
            <ClipboardPaste size={14} /> <span className="hidden md:inline">Import</span>
          </button>

          <button onClick={() => setActiveModal("overview")} className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-2 sm:px-3 sm:py-2 rounded-lg font-bold text-xs sm:text-sm border border-zinc-700 shrink-0">
            <Maximize size={14} /> <span className="hidden lg:inline">Overview</span>
          </button>

          <button onClick={handleAddClick} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white p-2 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-lg shadow-red-500/20 shrink-0">
            <Plus size={14} /> <span>Add</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-zinc-900 sm:border border-zinc-800 sm:rounded-xl overflow-hidden shadow-lg relative -mx-4 sm:mx-0">
        {classes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
            <LayoutGrid size={40} className="opacity-20 mb-3" />
            <p className="font-bold text-sm sm:text-base">No classes scheduled yet.</p>
          </div>
        ) : (
          viewMode === "grid" ? <WeeklyGrid classes={classes} onClassClick={handleBlockClick} isCompact={isCompact} /> : <DailyStack classes={classes} onClassClick={handleBlockClick} />
        )}
      </div>

      {activeModal === "view" && <ClassDetailsModal classData={selectedClass} onClose={closeModal} onEdit={handleEditTrigger} />}
      {(activeModal === "edit" || activeModal === "add") && <AddClassModal onClose={closeModal} editData={activeModal === "edit" ? selectedClass : null} />}
      {activeModal === "import" && <ImportScheduleModal onClose={closeModal} />}
      {activeModal === "overview" && <ScheduleOverviewModal onClose={closeModal} />}      
    </div>
  );
}

function WeeklyGrid({ classes, onClassClick, isCompact }) {
  const DAYS = [{ name: "Mon", index: 1 }, { name: "Tue", index: 2 }, { name: "Wed", index: 3 }, { name: "Thu", index: 4 }, { name: "Fri", index: 5 }, { name: "Sat", index: 6 }, { name: "Sun", index: 0 }];
  const START_HOUR = 7; const END_HOUR = 21; const TOTAL_HOURS = END_HOUR - START_HOUR;
  const PERIODS = ["07:00 AM", "08:10 AM", "09:20 AM", "10:30 AM", "11:40 AM", "12:50 PM", "02:00 PM", "03:10 PM", "04:20 PM", "05:30 PM", "06:40 PM", "07:50 PM", "09:00 PM"];

  const getMinutesFromStart = (timeStr) => { const [h, m] = timeStr.split(":").map(Number); return (h * 60 + m) - (START_HOUR * 60); };
  const colorMap = { blue: "bg-blue-500/20 border-blue-500 text-blue-300", emerald: "bg-emerald-500/20 border-emerald-500 text-emerald-300", rose: "bg-rose-500/20 border-rose-500 text-rose-300", amber: "bg-amber-500/20 border-amber-500 text-amber-300", purple: "bg-purple-500/20 border-purple-500 text-purple-300", zinc: "bg-zinc-500/20 border-zinc-500 text-zinc-300" };

  const processOverlaps = (dayClasses) => {
    const sorted = [...dayClasses].sort((a, b) => getMinutesFromStart(a.startTime) - getMinutesFromStart(b.startTime));
    let columns = [];
    sorted.forEach(cls => {
      let placed = false;
      for (let col of columns) {
        if (getMinutesFromStart(cls.startTime) >= getMinutesFromStart(col[col.length - 1].endTime)) { col.push(cls); placed = true; break; }
      }
      if (!placed) columns.push([cls]);
    });
    const result = [];
    columns.forEach((col, colIndex) => col.forEach(cls => result.push({ ...cls, _widthPercent: 100 / columns.length, _leftPercent: (100 / columns.length) * colIndex })));
    return result;
  };

  const formatTimeUI = (timeStr) => { let [h, m] = timeStr.split(":"); h = parseInt(h); const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m}`; };

  return (
    <div className="h-full relative animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-auto custom-scrollbar bg-zinc-900 sm:rounded-xl">
        <div className="min-w-[700px] min-h-full flex flex-col p-2 sm:p-6">
          <div className="flex border-b border-zinc-800 pb-1 mb-1 ml-12 sm:ml-16 sticky top-0 bg-zinc-900 z-30 pt-1">
            {DAYS.map((day) => <div key={day.name} className="flex-1 text-center text-[9px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">{day.name}</div>)}
          </div>
          <div className={`relative flex flex-1 transition-all duration-500 ${isCompact ? "min-h-[450px]" : "min-h-[800px]"}`}>
            <div className="w-12 sm:w-16 flex flex-col justify-between text-[8px] sm:text-[10px] font-bold text-zinc-400 border-r border-zinc-800/50 pr-1.5 pt-1.5 pb-1.5 text-right shrink-0 sticky left-0 bg-zinc-900 z-20">
              {PERIODS.map((time, i) => <span key={i} className="-mt-1.5 bg-zinc-900 z-10 whitespace-nowrap">{time.replace(" AM","").replace(" PM","")}</span>)}
            </div>
            <div className="flex-1 flex relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {PERIODS.map((_, i) => <div key={i} className="w-full border-t border-zinc-800/30"></div>)}
              </div>
              {DAYS.map((dayObj) => {
                const processedClasses = processOverlaps(classes.filter(c => c.days.includes(dayObj.index)));
                return (
                  <div key={dayObj.name} className="flex-1 relative border-r border-zinc-800/20 last:border-0">
                    {processedClasses.map(cls => {
                      const startMins = getMinutesFromStart(cls.startTime);
                      const duration = getMinutesFromStart(cls.endTime) - startMins;
                      return (
                        <div key={`${cls.id}-${dayObj.index}`} onClick={() => onClassClick(cls)} className={`absolute rounded border overflow-hidden shadow-sm cursor-pointer flex flex-col ${colorMap[cls.color] || colorMap.zinc} p-1`} style={{ top: `${(startMins / (TOTAL_HOURS * 60)) * 100}%`, height: `${(duration / (TOTAL_HOURS * 60)) * 100}%`, width: `calc(${cls._widthPercent}% - 2px)`, left: `calc(${cls._leftPercent}% + 1px)` }}>
                          <h4 className="font-extrabold text-[9px] sm:text-xs leading-none break-words">{cls.code}</h4>
                          <span className="font-bold opacity-80 text-[7px] sm:text-[9px] truncate">{formatTimeUI(cls.startTime)} - {formatTimeUI(cls.endTime)}</span>
                          <p className="font-bold mt-auto bg-black/30 inline-block rounded max-w-full truncate text-[7px] sm:text-[9px] px-1 py-0.5">{cls.room}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyStack({ classes, onClassClick }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const DAYS = [{ name: "Monday", short: "Mon", index: 1 }, { name: "Tuesday", short: "Tue", index: 2 }, { name: "Wednesday", short: "Wed", index: 3 }, { name: "Thursday", short: "Thu", index: 4 }, { name: "Friday", short: "Fri", index: 5 }, { name: "Saturday", short: "Sat", index: 6 }, { name: "Sunday", short: "Sun", index: 0 }];
  const colorMap = { blue: "border-l-blue-500", emerald: "border-l-emerald-500", rose: "border-l-rose-500", amber: "border-l-amber-500", purple: "border-l-purple-500", zinc: "border-l-zinc-500" };

  const formatTimeUI = (timeStr) => { let [h, m] = timeStr.split(":"); h = parseInt(h); const ampm = h >= 12 ? 'PM' : 'AM'; return `${h % 12 || 12}:${m} ${ampm}`; };
  const dayClasses = classes.filter(c => c.days.includes(selectedDay)).sort((a, b) => parseInt(a.startTime.replace(":","")) - parseInt(b.startTime.replace(":","")));

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 p-2 sm:p-6">
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-zinc-800 custom-scrollbar shrink-0 px-2 sm:px-0">
        {DAYS.map((day) => (
          <button key={day.index} onClick={() => setSelectedDay(day.index)} className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${selectedDay === day.index ? "bg-red-600 text-white" : "bg-zinc-950 text-zinc-400 border border-zinc-800"}`}>
            <span className="hidden sm:inline">{day.name}</span><span className="sm:hidden">{day.short}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-2 sm:px-0 space-y-2 custom-scrollbar pb-4">
        {dayClasses.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-zinc-500 bg-zinc-950/50 rounded-xl border border-zinc-800/50 border-dashed text-sm">No classes today.</div>
        ) : (
          dayClasses.map((cls) => (
            <div key={cls.id} onClick={() => onClassClick(cls)} className={`flex items-center justify-between bg-zinc-950 border-y border-r border-zinc-800 border-l-4 rounded-xl p-3 cursor-pointer shadow-sm ${colorMap[cls.color] || colorMap.zinc}`}>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                  <Clock size={12} /><span>{formatTimeUI(cls.startTime)} - {formatTimeUI(cls.endTime)}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white leading-tight">{cls.code}</h4>
                  <p className="text-[10px] sm:text-xs font-medium text-zinc-400 truncate max-w-[200px]">{cls.title.replace("Section: ", "")}</p>
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{cls.room} • {cls.type}</div>
              </div>
              <ChevronRight size={16} className="text-zinc-600" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}