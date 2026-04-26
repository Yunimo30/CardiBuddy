import { useState } from "react";
import { useTracker } from "../context/TrackerContext";
import { X, Check, Trash2 } from "lucide-react";

export default function AddClassModal({ onClose, editData }) {
  // Bring in our new update function alongside save and delete
  const { saveClass, updateClass, deleteClass } = useTracker();
  const isEditing = !!editData;

  // If editData exists, pre-fill the form. Otherwise, use defaults.
  const [formData, setFormData] = useState(editData || {
    code: "",
    title: "",
    room: "",
    type: "F2F", 
    days: [], 
    startTime: "09:00",
    endTime: "10:30",
    color: "blue"
  });

  // Shifted Sunday (0) to the end of the array to match our new calendar logic
  const DAYS = [
    { num: 1, label: "M" }, { num: 2, label: "T" }, 
    { num: 3, label: "W" }, { num: 4, label: "Th" }, 
    { num: 5, label: "F" }, { num: 6, label: "S" },
    { num: 0, label: "Su" } 
  ];

  const COLORS = [
    { name: "blue", hex: "bg-blue-500" }, { name: "emerald", hex: "bg-emerald-500" },
    { name: "rose", hex: "bg-rose-500" }, { name: "amber", hex: "bg-amber-500" },
    { name: "purple", hex: "bg-purple-500" }, { name: "zinc", hex: "bg-zinc-500" }
  ];

  const toggleDay = (dayNum) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayNum) 
        ? prev.days.filter(d => d !== dayNum) 
        : [...prev.days, dayNum]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || formData.days.length === 0) {
      alert("Please provide a course code and select at least one day.");
      return;
    }

    if (isEditing) {
      updateClass(formData); // Use update for existing
    } else {
      const newClass = { ...formData, id: `class-${Date.now()}` };
      saveClass(newClass); // Use save for new
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${formData.code}?`)) {
      deleteClass(formData.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h3 className="font-bold text-xl text-white mb-6 tracking-tight">
          {isEditing ? `Edit ${formData.code}` : "Add New Course"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Code</label>
              <input 
                type="text" required placeholder="CSS155"
                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Course Title</label>
              <input 
                type="text" required placeholder="Data Engineering"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Modality</label>
              <select 
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors appearance-none"
              >
                <option value="F2F">F2F (In-Person)</option>
                <option value="Online">Online</option>
                <option value="Alternating">Alternating</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Room / Link</label>
              <input 
                type="text" placeholder="Lab 201"
                value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Days</label>
            <div className="flex gap-2">
              {DAYS.map(day => (
                <button
                  key={day.num} type="button" onClick={() => toggleDay(day.num)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                    formData.days.includes(day.num) ? "bg-red-600 text-white shadow-md" : "bg-zinc-950 text-zinc-500 border border-zinc-800"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Start Time</label>
              <input 
                type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-500 dark:[color-scheme:dark]"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">End Time</label>
              <input 
                type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-500 dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Display Color</label>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button
                  key={c.name} type="button" onClick={() => setFormData({...formData, color: c.name})}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${c.hex} ${formData.color === c.name ? "ring-2 ring-white scale-110 shadow-lg" : "opacity-50 hover:opacity-100"}`}
                >
                  {formData.color === c.name && <Check size={14} className="text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 mt-2 border-t border-zinc-800 flex gap-3">
            {isEditing && (
              <button 
                type="button" onClick={handleDelete}
                className="flex items-center justify-center p-3 bg-zinc-950 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Delete Course"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button type="submit" className="flex-1 bg-white text-zinc-950 py-3 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors">
              {isEditing ? "Update Course" : "Save Course"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}