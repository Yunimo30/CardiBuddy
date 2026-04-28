import { useState, useEffect } from "react";
import { useTracker } from "../context/TrackerContext";
import { Link2, Video, FileText, Plus, ExternalLink, Trash2, BookOpen } from "lucide-react";

export default function ResourceHub() {
  const { classes } = useTracker();
  
  const uniqueCourses = classes.reduce((acc, current) => {
    if (!acc.find(item => item.code === current.code)) acc.push(current);
    return acc;
  }, []);

  const [selectedCourseCode, setSelectedCourseCode] = useState(uniqueCourses.length > 0 ? uniqueCourses[0].code : null);
  const [resources, setResources] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", url: "", type: "link" });

  useEffect(() => {
    const saved = localStorage.getItem("cardiBuddy_resources");
    if (saved) setResources(JSON.parse(saved));
  }, []);

  const saveResources = (newResources) => {
    setResources(newResources);
    localStorage.setItem("cardiBuddy_resources", JSON.stringify(newResources));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url || !selectedCourseCode) return;

    let finalUrl = newResource.url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const updated = { ...resources };
    if (!updated[selectedCourseCode]) updated[selectedCourseCode] = [];
    
    updated[selectedCourseCode].push({ id: Date.now().toString(), ...newResource, url: finalUrl });
    saveResources(updated);
    setNewResource({ title: "", url: "", type: "link" });
    setIsAdding(false);
  };

  const handleDeleteResource = (resourceId) => {
    const updated = { ...resources };
    updated[selectedCourseCode] = updated[selectedCourseCode].filter(r => r.id !== resourceId);
    saveResources(updated);
  };

  const getTypeIcon = (type) => {
    if (type === "video") return <Video size={16} className="text-blue-400" />;
    if (type === "document") return <FileText size={16} className="text-emerald-400" />;
    return <Link2 size={16} className="text-rose-400" />;
  };

  const activeCourseData = uniqueCourses.find(c => c.code === selectedCourseCode);
  const currentResources = resources[selectedCourseCode] || [];

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-2 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Resource Hub</h1>
        <p className="text-[10px] sm:text-sm font-medium text-zinc-400 mt-0.5 sm:mt-1">Manage Zoom links, syllabi, and study materials</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 sm:gap-6 overflow-hidden pb-2 sm:pb-6">
        
        {/* Horizontal Pill Bar on Mobile */}
        <div className="w-full md:w-1/3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg shrink-0">
          <div className="hidden md:block p-4 border-b border-zinc-800 bg-zinc-950/50">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-widest">Your Courses</h3>
          </div>
          <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-1.5 sm:p-2 gap-1.5 md:gap-0 md:space-y-1 custom-scrollbar">
            {uniqueCourses.length === 0 ? (
              <p className="text-center text-zinc-500 text-sm mt-4 w-full">No classes added.</p>
            ) : (
              uniqueCourses.map(course => (
                <button
                  key={course.code}
                  onClick={() => { setSelectedCourseCode(course.code); setIsAdding(false); }}
                  className={`min-w-[120px] md:min-w-0 shrink-0 w-full text-left p-2 sm:p-3 rounded-lg transition-all flex items-center justify-between ${
                    selectedCourseCode === course.code 
                      ? "bg-zinc-800 text-white border border-zinc-700 shadow-md" 
                      : "text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm">{course.code}</p>
                    <p className="text-[9px] sm:text-[10px] opacity-70 truncate max-w-[100px] md:max-w-[180px]">{course.title.replace("Section: ", "")}</p>
                  </div>
                  <div className="hidden sm:block bg-zinc-950 px-2 py-1 rounded text-[10px] font-bold">
                    {(resources[course.code] || []).length} items
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
          {activeCourseData ? (
            <>
              <div className="p-3 sm:p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/20 shrink-0">
                <div className="overflow-hidden">
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white truncate">{activeCourseData.code}</h2>
                  <p className="text-[10px] sm:text-sm text-zinc-400 font-medium truncate">{activeCourseData.title.replace("Section: ", "")}</p>
                </div>
                <button 
                  onClick={() => setIsAdding(!isAdding)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-red-500/20 shrink-0"
                >
                  <Plus size={14} /> {isAdding ? "Cancel" : <span className="hidden sm:inline">Add Resource</span>}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-zinc-900/50">
                
                {isAdding && (
                  <form onSubmit={handleAddResource} className="bg-zinc-950 border border-zinc-700 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 shadow-xl">
                    <h4 className="font-bold text-white text-xs sm:text-sm mb-3">New Resource</h4>
                    <div className="flex flex-col md:flex-row gap-3 mb-3">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Title</label>
                        <input type="text" required placeholder="e.g., Main Zoom" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs sm:text-sm text-white focus:border-red-500 outline-none transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">URL</label>
                        <input type="text" required placeholder="zoom.us/j/..." value={newResource.url} onChange={e => setNewResource({...newResource, url: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs sm:text-sm text-white focus:border-red-500 outline-none transition-colors" />
                      </div>
                      <div className="w-full md:w-28">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Type</label>
                        <select value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-xs sm:text-sm text-white focus:border-red-500 outline-none transition-colors appearance-none">
                          <option value="link">Link</option>
                          <option value="video">Meeting</option>
                          <option value="document">Doc</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-white text-zinc-950 py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-zinc-200 transition-colors">Save</button>
                  </form>
                )}

                {currentResources.length === 0 && !isAdding ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60 text-center p-4">
                    <BookOpen size={40} className="mb-3 sm:w-12 sm:h-12" />
                    <p className="font-bold text-sm sm:text-base">No resources saved.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                    {currentResources.map(res => (
                      <div key={res.id} className="group bg-zinc-950 border border-zinc-800 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm relative">
                        <div className="flex items-center gap-3 overflow-hidden pr-8">
                          <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800 shrink-0">
                            {getTypeIcon(res.type)}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{res.title}</h4>
                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-zinc-500 hover:text-red-400 truncate flex items-center gap-1 mt-0.5 transition-colors">
                              {res.url.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteResource(res.id)}
                          className="absolute right-2 sm:static text-zinc-600 hover:text-red-500 p-2 transition-colors sm:opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 font-medium text-xs sm:text-base">
              Select a course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}