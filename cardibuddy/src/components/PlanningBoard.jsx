import { useState, useEffect } from "react";
import { useTracker } from "../context/TrackerContext";
import { Circle, CheckCircle2 } from "lucide-react";

export default function PlanningBoard() {
  const { selectedWeek } = useTracker();
  // Default to Calendar view now
  const [activeTab, setActiveTab] = useState("calendar"); 
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem(`cardibuddy_notes_w${selectedWeek}`);
    setNotes(savedNotes || "");
  }, [selectedWeek]);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem(`cardibuddy_notes_w${selectedWeek}`, val);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Week ${selectedWeek} Focus:\n${notes}`);
    alert("Copied to clipboard!");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col h-full shadow-lg overflow-hidden relative">
      
      {/* Header & Toggle Switch */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <h2 className="font-bold text-zinc-100 uppercase tracking-widest text-xs">
          Planning Board
        </h2>
        
        <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
              activeTab === "calendar" 
                ? "bg-red-500 text-white shadow-md" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setActiveTab("agenda")}
            className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
              activeTab === "agenda" 
                ? "bg-red-500 text-white shadow-md" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        {activeTab === "calendar" ? (
          <CalendarView selectedWeek={selectedWeek} />
        ) : (
          <AgendaView 
            notes={notes} 
            handleNotesChange={handleNotesChange} 
            copyToClipboard={copyToClipboard} 
          />
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS --- //

function CalendarView({ selectedWeek }) {
  const { termConfig, calendarEvents, addEvent } = useTracker();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalInput, setModalInput] = useState("");
  
  const baseDate = termConfig.startDate; 
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); 
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); 
  
  const todayObj = new Date();
  todayObj.setHours(0,0,0,0); // Normalize time for accurate comparison
  const todayStr = todayObj.toDateString();

  const getDayStatus = (dateObj) => {
    if (dateObj.toDateString() === todayStr) return "Today";
    const isHoliday = termConfig.holidays.some(h => h.date.toDateString() === dateObj.toDateString());
    if (isHoliday) return "Holiday";
    if (dateObj.getDay() === 0) return "No Class";
    return "School Day";
  };

  const handleDayClick = (day) => {
    const dateObj = new Date(year, month, day);
    setSelectedDate(dateObj);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (modalInput.trim() && selectedDate) {
      addEvent(selectedDate.toDateString(), modalInput.trim());
      setModalInput("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold tracking-widest text-zinc-300 uppercase text-xs">
          Academic Calendar
        </h3>
        <div className="flex gap-3 text-[10px] font-bold tracking-wider">
          <span className="flex items-center gap-1 text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Today</span>
          <span className="flex items-center gap-1 text-green-500"><div className="w-2 h-2 rounded-full bg-green-500"></div>School</span>
          <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 rounded-full bg-red-500"></div>Holiday</span>
          <span className="flex items-center gap-1 text-zinc-500"><div className="w-2 h-2 rounded-full bg-zinc-600"></div>No Class</span>
        </div>
      </div>
      
      <h4 className="text-center font-bold text-lg mb-4 uppercase tracking-widest text-zinc-100">
        {baseDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h4>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <div key={d} className="text-[10px] font-bold text-zinc-500">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
        {[...Array(firstDayOfWeek)].map((_, i) => <div key={`empty-${i}`} />)}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const currentDate = new Date(year, month, day);
          const status = getDayStatus(currentDate);
          
          const isPast = currentDate < todayObj;
          const dateStr = currentDate.toDateString();
          const hasEvents = calendarEvents && calendarEvents[dateStr] && calendarEvents[dateStr].length > 0;
          
          let textColor = "text-zinc-300";
          let bgClass = "hover:bg-zinc-800";
          
          if (status === "Today") {
            textColor = "text-white";
            bgClass = "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500";
          } else if (status === "Holiday") {
            textColor = "text-red-500 hover:text-red-400";
          } else if (status === "School Day") {
            textColor = "text-green-500 hover:text-green-400";
          } else if (status === "No Class") {
            textColor = "text-zinc-600";
          }

          return (
            <div 
              key={day} 
              onClick={() => handleDayClick(day)}
              // Add the opacity-40 class if the day is in the past
              className={`relative flex flex-col items-center justify-center rounded-full text-sm font-bold cursor-pointer transition-all mx-auto w-10 h-10 ${textColor} ${bgClass} ${isPast ? "opacity-40" : ""}`}
            >
              {day}
              {hasEvents && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]"></div>}
            </div>
          );
        })}
      </div>

      {/* Custom Pop-up Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-white mb-1">Add Event</h3>
            <p className="text-xs text-zinc-400 mb-4">
              {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <input 
              type="text" 
              autoFocus
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              placeholder="e.g., Study for CSS155, Submit Project..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-red-500 mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEvent()}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSaveEvent} className="px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STRUCTURED AGENDA VIEW --- //

function AgendaView({ notes, handleNotesChange, copyToClipboard }) {
  const { selectedWeek, termConfig, calendarEvents, toggleEventCompletion } = useTracker();
  
  const weekStartDate = new Date(termConfig.startDate);
  weekStartDate.setDate(weekStartDate.getDate() + ((selectedWeek - 1) * 7));
  
  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-300">
      
      {/* Daily Breakdown */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        <label className="text-xs font-bold text-zinc-500 tracking-widest uppercase sticky top-0 bg-zinc-900 pb-2 z-10">
          Week {selectedWeek} Schedule
        </label>
        
        {weekDays.map((date, i) => {
          const dateStr = date.toDateString();
          const events = calendarEvents[dateStr] || [];
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={i} className={`p-3 rounded-lg border transition-colors ${isToday ? "bg-blue-900/10 border-blue-900/50" : "bg-zinc-950 border-zinc-800/50"} flex flex-col gap-2`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-blue-400" : "text-zinc-500"}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              {events.length > 0 ? (
                <ul className="text-sm space-y-2 mt-1">
                  {events.map((ev) => (
                    <li 
                      key={ev.id} 
                      onClick={() => toggleEventCompletion(dateStr, ev.id)}
                      className="flex items-start gap-2 group cursor-pointer"
                    >
                      {/* Interactive Checkbox */}
                      <div className="mt-0.5 shrink-0 transition-transform active:scale-75">
                        {ev.completed ? (
                          <CheckCircle2 size={16} className="text-red-500" />
                        ) : (
                          <Circle size={16} className="text-zinc-500 group-hover:text-zinc-400" />
                        )}
                      </div>
                      
                      {/* Strikethrough Text Animation */}
                      <span className={`transition-all duration-300 ${
                        ev.completed ? "text-zinc-600 line-through decoration-zinc-600" : "text-zinc-300"
                      }`}>
                        {ev.text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-zinc-600 italic mt-1">No scheduled events</span>
              )}
            </div>
          );
        })}
      </div>

      {/* General Weekly Focus */}
      <div className="flex flex-col h-32 shrink-0">
        <label className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">
          General Week Notes
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Main priorities not tied to a specific day..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:border-red-500 resize-none transition-colors"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 shrink-0">
        <button onClick={copyToClipboard} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold text-sm transition-colors border border-zinc-700">📋 Copy Status</button>
        <button onClick={() => alert("PDF Export later!")} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">📄 Save PDF</button>
      </div>
    </div>
  );
}