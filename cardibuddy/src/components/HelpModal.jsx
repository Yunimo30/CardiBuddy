import { useState } from "react";
import { X, LayoutDashboard, CalendarDays, Link as LinkIcon, Calculator, BookOpen, ChevronRight } from "lucide-react";

export default function HelpModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", icon: <BookOpen size={18} />, label: "Getting Started" },
    { id: "schedule", icon: <CalendarDays size={18} />, label: "Class Schedule" },
    { id: "resources", icon: <LinkIcon size={18} />, label: "Resource Hub" },
    { id: "gpa", icon: <Calculator size={18} />, label: "GPA Engine" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl relative max-h-[85vh] flex flex-col md:flex-row overflow-hidden">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="font-extrabold text-white">Help Center</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-zinc-950/50 border-r border-zinc-800 flex flex-col shrink-0">
          <div className="hidden md:flex justify-between items-center p-6 border-b border-zinc-800">
            <h3 className="font-extrabold text-xl text-white">Help Center</h3>
          </div>
          
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-4 gap-2 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal text-left ${
                  activeTab === tab.id 
                    ? "bg-red-600/10 text-red-500 border border-red-500/20" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
                }`}
              >
                {tab.icon}
                <span className="flex-1">{tab.label}</span>
                <ChevronRight size={16} className={`hidden md:block transition-transform ${activeTab === tab.id ? "translate-x-1" : "opacity-0"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-zinc-900 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors hidden md:block bg-zinc-800 p-1.5 rounded-lg">
            <X size={18} />
          </button>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Welcome to CardiBuddy</h2>
                  <p className="text-zinc-400 leading-relaxed">CardiBuddy is your ultimate academic command center. It is designed to replace cluttered notebooks, scattered links, and confusing grading syllabi.</p>
                </div>
                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-white mb-2">The Golden Rule</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Everything in CardiBuddy is connected. Start by adding your classes in the <strong>Schedule</strong> tab. Once your classes are loaded, the Resource Hub and GPA Engine will automatically detect them, allowing you to organize links and grades effortlessly.</p>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Class Schedule</h2>
                  <p className="text-zinc-400 leading-relaxed">Build your weekly timetable to see exactly where you need to be.</p>
                </div>
                <ul className="space-y-4">
                  <li className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <strong className="text-white block mb-1">Adding a Course</strong>
                    <span className="text-sm text-zinc-400">Click the red "Add Course" button. You can pick custom colors and specify if the class is Online or Face-to-Face (F2F).</span>
                  </li>
                  <li className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <strong className="text-white block mb-1">The Overview Button</strong>
                    <span className="text-sm text-zinc-400">Need to see the big picture? Click "Overview" to view your entire week in a strict, unscrollable grid—perfect for taking a quick screenshot.</span>
                  </li>
                  <li className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <strong className="text-white block mb-1">Density Toggle</strong>
                    <span className="text-sm text-zinc-400">If your schedule has long gaps, click the shrink/expand icon next to the layout buttons to switch between a comfortable and compact grid height.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">Resource Hub</h2>
                  <p className="text-zinc-400 leading-relaxed">Stop hunting for Zoom links and syllabi in your email.</p>
                </div>
                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <h4 className="font-bold text-white mb-2">How to Use</h4>
                  <ol className="text-sm text-zinc-400 leading-relaxed list-decimal list-inside space-y-2">
                    <li>Select a course from the left sidebar.</li>
                    <li>Click <strong>Add Resource</strong> in the top right.</li>
                    <li>Paste your Zoom link, Google Drive folder, or syllabus URL.</li>
                    <li>Categorize it as a Meeting, Document, or generic Link.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === "gpa" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">GPA Engine</h2>
                  <p className="text-zinc-400 leading-relaxed">Never guess what you need to score on a final exam again.</p>
                </div>
                <ul className="space-y-4">
                  <li className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <strong className="text-white block mb-1">1. Build Your Schema</strong>
                    <span className="text-sm text-zinc-400">Check your professor's syllabus and add categories (e.g., Quizzes: 20%, Midterm: 30%). Ensure your total weight equals 100%.</span>
                  </li>
                  <li className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <strong className="text-white block mb-1">2. Enter Scores (Earned / Max)</strong>
                    <span className="text-sm text-zinc-400">If a quiz is worth 50 points and you got a 45, type <code>45</code> in the first box and <code>50</code> in the second. The engine handles the math automatically.</span>
                  </li>
                  <li className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <strong className="text-white block mb-1">3. Track Your Target</strong>
                    <span className="text-sm text-zinc-400">Set your Target % at the top. The engine will constantly calculate the exact average you need on all remaining assignments to hit your goal.</span>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}