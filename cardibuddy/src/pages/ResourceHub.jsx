import { useState, useEffect } from "react";
import { useTracker } from "../context/TrackerContext";
import { Link2, Video, FileText, Plus, ExternalLink, Trash2, BookOpen } from "lucide-react";

export default function ResourceHub() {
  const { classes } = useTracker();
  
  // 1. DEDUPLICATE CLASSES BY COURSE CODE
  const uniqueCourses = classes.reduce((acc, current) => {
    if (!acc.find(item => item.code === current.code)) {
      acc.push(current);
    }
    return acc;
  }, []);

  // 2. USE THE COURSE CODE AS THE STATE ID
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
    // Save under the Course Code, not the block ID
    if (!updated[selectedCourseCode]) updated[selectedCourseCode] = [];
    
    updated[selectedCourseCode].push({
      id: Date.now().toString(),
      ...newResource,
      url: finalUrl
    });

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

  // Find the representative class object to display title/info
  const activeCourseData = uniqueCourses.find(c => c.code === selectedCourseCode);
  const currentResources = resources[selectedCourseCode] || [];

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Resource Hub</h1>
        <p className="text-sm font-medium text-zinc-400 mt-1">Manage Zoom links, syllabi, and study materials</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden pb-6">
        
        {/* Left Pane: Unique Course List */}
        <div className="w-full md:w-1/3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg shrink-0">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-widest">Your Courses</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {uniqueCourses.length === 0 ? (
              <p className="text-center text-zinc-500 text-sm mt-4">No classes added yet.</p>
            ) : (
              uniqueCourses.map(course => (
                <button
                  key={course.code}
                  onClick={() => { setSelectedCourseCode(course.code); setIsAdding(false); }}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                    selectedCourseCode === course.code 
                      ? "bg-zinc-800 text-white border border-zinc-700 shadow-md" 
                      : "text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-sm">{course.code}</p>
                    <p className="text-[10px] opacity-70 truncate max-w-[180px]">{course.title.replace("Section: ", "")}</p>
                  </div>
                  <div className="bg-zinc-950 px-2 py-1 rounded text-[10px] font-bold">
                    {(resources[course.code] || []).length} items
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Resource Details */}
        <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
          {activeCourseData ? (
            <>
              <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-950/20">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{activeCourseData.code}</h2>
                  <p className="text-sm text-zinc-400 font-medium">{activeCourseData.title.replace("Section: ", "")}</p>
                </div>
                <button 
                  onClick={() => setIsAdding(!isAdding)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
                >
                  <Plus size={16} /> {isAdding ? "Cancel" : "Add Resource"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-900/50">
                
                {isAdding && (
                  <form onSubmit={handleAddResource} className="bg-zinc-950 border border-zinc-700 p-4 rounded-xl mb-6 animate-in slide-in-from-top-4 duration-300 shadow-xl">
                    <h4 className="font-bold text-white text-sm mb-4">New Resource Bookmark</h4>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Title</label>
                        <input type="text" required placeholder="e.g., Main Zoom Link" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-red-500 outline-none transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">URL</label>
                        <input type="text" required placeholder="zoom.us/j/1234..." value={newResource.url} onChange={e => setNewResource({...newResource, url: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-red-500 outline-none transition-colors" />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Type</label>
                        <select value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-red-500 outline-none transition-colors appearance-none">
                          <option value="link">Link</option>
                          <option value="video">Meeting</option>
                          <option value="document">Document</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors">Save Resource</button>
                  </form>
                )}

                {currentResources.length === 0 && !isAdding ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
                    <BookOpen size={48} className="mb-4" />
                    <p className="font-bold">No resources saved.</p>
                    <p className="text-sm">Store your syllabus, class portal, and meeting links here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {currentResources.map(res => (
                      <div key={res.id} className="group bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all flex items-start justify-between shadow-md">
                        <div className="flex items-start gap-3 overflow-hidden">
                          <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800 shrink-0">
                            {getTypeIcon(res.type)}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-white text-sm truncate">{res.title}</h4>
                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-red-400 truncate flex items-center gap-1 mt-0.5 transition-colors">
                              {res.url.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-zinc-600 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
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
            <div className="h-full flex items-center justify-center text-zinc-600 font-medium">
              Select a course from the left menu.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}