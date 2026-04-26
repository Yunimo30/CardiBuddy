import { X, Clock, MapPin, Monitor, Edit3, CalendarSync } from "lucide-react";

export default function ClassDetailsModal({ classData, onClose, onEdit }) {
  if (!classData) return null;

  // Helper to format "09:00" -> "9:00 AM"
  const formatTime = (timeStr) => {
    let [h, m] = timeStr.split(":");
    h = parseInt(h);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  // Determine which icon to show based on modality
  const getModalityIcon = () => {
    if (classData.type === "Online") return <Monitor size={16} className="text-blue-400" />;
    if (classData.type === "Alternating") return <CalendarSync size={16} className="text-purple-400" />;
    return <MapPin size={16} className="text-emerald-400" />; // Default F2F
  };

  // Map numbers back to day names for the display
  const dayNames = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
  const daysString = classData.days.map(d => dayNames[d]).join(", ");

  // Dynamic background glow based on the user's chosen class color
  const glowColors = {
    blue: "shadow-blue-500/20", emerald: "shadow-emerald-500/20",
    rose: "shadow-rose-500/20", amber: "shadow-amber-500/20",
    purple: "shadow-purple-500/20", zinc: "shadow-zinc-500/20"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className={`bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative ${glowColors[classData.color] || "shadow-zinc-500/20"}`}>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Header Content */}
        <div className="mb-6 pr-6">
          <h3 className="font-extrabold text-3xl text-white tracking-tight leading-none mb-2">
            {classData.code}
          </h3>
          <p className="text-zinc-400 font-medium">{classData.title}</p>
        </div>

        {/* Details Grid */}
        <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 space-y-4 mb-6">
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-zinc-500"><Clock size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Time & Day</p>
              <p className="text-sm text-zinc-200 font-medium mt-0.5">{daysString}</p>
              <p className="text-sm text-zinc-400">{formatTime(classData.startTime)} - {formatTime(classData.endTime)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getModalityIcon()}</div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Location</p>
              <p className="text-sm text-zinc-200 font-medium mt-0.5">{classData.room}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{classData.type}</p>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button 
          onClick={onEdit} 
          className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-white/5"
        >
          <Edit3 size={16} /> Edit Course Details
        </button>

      </div>
    </div>
  );
}