import { useState, useEffect } from "react";
import { useTracker } from "../context/TrackerContext";
import { Calculator, Plus, Trash2, Target, AlertTriangle, GraduationCap } from "lucide-react";

export default function GpaEngine() {
  const { classes } = useTracker();
  
  const uniqueCourses = classes.reduce((acc, current) => {
    if (!acc.find(item => item.code === current.code)) acc.push(current);
    return acc;
  }, []);

  const [selectedCourseCode, setSelectedCourseCode] = useState(uniqueCourses.length > 0 ? uniqueCourses[0].code : null);
  
  const [schemas, setSchemas] = useState({});
  const [targetGrades, setTargetGrades] = useState({});

  const DEFAULT_SCHEMA = [
    { id: "1", name: "Midterm Exam", weight: 30, earned: "", max: "100" },
    { id: "2", name: "Final Exam", weight: 30, earned: "", max: "100" },
    { id: "3", name: "Coursework / Quizzes", weight: 40, earned: "", max: "100" }
  ];

  useEffect(() => {
    const savedSchemas = localStorage.getItem("cardiBuddy_gpa_schemas");
    const savedTargets = localStorage.getItem("cardiBuddy_gpa_targets");
    if (savedSchemas) setSchemas(JSON.parse(savedSchemas));
    if (savedTargets) setTargetGrades(JSON.parse(savedTargets));
  }, []);

  const saveToStorage = (newSchemas, newTargets) => {
    setSchemas(newSchemas);
    setTargetGrades(newTargets);
    localStorage.setItem("cardiBuddy_gpa_schemas", JSON.stringify(newSchemas));
    localStorage.setItem("cardiBuddy_gpa_targets", JSON.stringify(newTargets));
  };

  const currentSchema = schemas[selectedCourseCode] || DEFAULT_SCHEMA;
  
  // FIX 1: Allow the target grade to be an empty string so the user can backspace freely
  const currentTargetRaw = targetGrades[selectedCourseCode];
  const currentTargetUI = currentTargetRaw !== undefined ? currentTargetRaw : 85;
  const targetNum = Number(currentTargetUI) || 0; // The actual math number

  const handleUpdateComponent = (id, field, value) => {
    const updatedSchema = currentSchema.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    );
    saveToStorage({ ...schemas, [selectedCourseCode]: updatedSchema }, targetGrades);
  };

  const handleAddComponent = () => {
    const newComponent = { id: Date.now().toString(), name: "New Category", weight: 0, earned: "", max: "100" };
    saveToStorage({ ...schemas, [selectedCourseCode]: [...currentSchema, newComponent] }, targetGrades);
  };

  const handleDeleteComponent = (id) => {
    const updatedSchema = currentSchema.filter(comp => comp.id !== id);
    saveToStorage({ ...schemas, [selectedCourseCode]: updatedSchema }, targetGrades);
  };

  const handleUpdateTarget = (val) => {
    // Save exactly what the user typed (even if it's an empty string)
    saveToStorage(schemas, { ...targetGrades, [selectedCourseCode]: val });
  };

  // --- MATH ENGINE ---
  const isGraded = (comp) => comp.earned !== "" && comp.max !== "" && Number(comp.max) > 0;

  const totalWeight = currentSchema.reduce((sum, comp) => sum + (Number(comp.weight) || 0), 0);
  
  const gradedWeight = currentSchema.reduce((sum, comp) => 
    isGraded(comp) ? sum + (Number(comp.weight) || 0) : sum, 0
  );
  
  const earnedPoints = currentSchema.reduce((sum, comp) => 
    isGraded(comp) ? sum + ((Number(comp.earned) / Number(comp.max)) * (Number(comp.weight) || 0)) : sum, 0
  );
  
  const currentStanding = gradedWeight > 0 ? (earnedPoints / gradedWeight) * 100 : 0;
  const pointsNeededForTarget = targetNum - earnedPoints;
  const remainingWeight = totalWeight - gradedWeight;
  const requiredAverage = remainingWeight > 0 ? (pointsNeededForTarget / remainingWeight) * 100 : 0;

  const activeCourseData = uniqueCourses.find(c => c.code === selectedCourseCode);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">GPA Engine</h1>
        <p className="text-sm font-medium text-zinc-400 mt-1">Design custom grading schemas and track your target grades</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden pb-6">
        
        {/* Left Pane: Course List */}
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
                  onClick={() => setSelectedCourseCode(course.code)}
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
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: The Calculator */}
        <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
          {activeCourseData ? (
            <>
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/20 shrink-0">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{activeCourseData.code}</h2>
                  <p className="text-sm text-zinc-400 font-medium">Grading Schema</p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-2 shadow-inner">
                  <Target size={18} className="text-red-500 ml-2" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Target %</span>
                  <input 
                    type="number" 
                    value={currentTargetUI} 
                    onChange={(e) => handleUpdateTarget(e.target.value)}
                    className="w-16 bg-zinc-900 border border-zinc-700 rounded text-white text-center font-bold text-sm py-1 outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-900/50 flex flex-col gap-4">
                
                {totalWeight !== 100 && (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                    <AlertTriangle size={16} /> 
                    Warning: Your total category weights add up to {totalWeight}%, not 100%.
                  </div>
                )}

                {currentSchema.map((comp) => (
                  <div key={comp.id} className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-sm hover:border-zinc-700 transition-colors">
                    
                    <div className="w-full sm:flex-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Category Name</label>
                      <input 
                        type="text" 
                        value={comp.name || ""} 
                        onChange={(e) => handleUpdateComponent(comp.id, "name", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:border-zinc-600 outline-none" 
                      />
                    </div>
                    
                    <div className="w-full sm:w-20">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Weight %</label>
                      <input 
                        type="number" 
                        value={comp.weight || ""} 
                        onChange={(e) => handleUpdateComponent(comp.id, "weight", e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white focus:border-zinc-600 outline-none text-center font-mono" 
                      />
                    </div>

                    <div className="w-full sm:w-36">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1 text-center">Score ( Earned / Max )</label>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          placeholder="--"
                          value={comp.earned || ""} 
                          onChange={(e) => handleUpdateComponent(comp.id, "earned", e.target.value)}
                          className={`w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm font-bold text-center outline-none transition-colors ${comp.earned && comp.earned !== "" ? "text-emerald-400 border-emerald-500/30" : "text-zinc-500"}`} 
                        />
                        <span className="text-zinc-600 font-bold px-1">/</span>
                        <input 
                          type="number" 
                          placeholder="100"
                          value={comp.max || ""} 
                          onChange={(e) => handleUpdateComponent(comp.id, "max", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm font-bold text-zinc-300 text-center outline-none focus:border-zinc-600 transition-colors" 
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="mt-4 sm:mt-0 p-2 text-zinc-600 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button 
                  onClick={handleAddComponent}
                  className="flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white p-3 rounded-xl transition-colors font-bold text-sm w-full"
                >
                  <Plus size={16} /> Add Grading Category
                </button>
              </div>

              {/* Sticky Results Footer */}
              <div className="border-t border-zinc-800 bg-zinc-950 p-6 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center shadow-inner">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Graded So Far</p>
                  <p className="text-xl font-extrabold text-white font-mono">{gradedWeight}%</p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center shadow-inner">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Standing</p>
                  <p className={`text-xl font-extrabold font-mono ${currentStanding >= targetNum ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {gradedWeight > 0 ? `${currentStanding.toFixed(1)}%` : "N/A"}
                  </p>
                </div>

                {/* FIX 2: Updated logic for a clean, green "Met!" state */}
                <div className={`rounded-lg p-3 text-center shadow-md border ${
                  remainingWeight <= 0 && currentStanding >= targetNum 
                    ? "bg-emerald-500/10 border-emerald-500/20" 
                    : (requiredAverage <= 100 && requiredAverage > 0 ? "bg-red-500/10 border-red-500/20" : "bg-zinc-900 border-zinc-800")
                }`}>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Needed for Target</p>
                  <p className={`text-xl font-extrabold font-mono ${
                    remainingWeight <= 0 
                      ? (currentStanding >= targetNum ? 'text-emerald-400' : 'text-rose-500') 
                      : (requiredAverage > 100 ? 'text-rose-500' : 'text-red-400')
                  }`}>
                    {remainingWeight > 0 ? `${requiredAverage.toFixed(1)}%` : (currentStanding >= targetNum ? "Met!" : "Missed")}
                  </p>
                </div>
              </div>

            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 font-medium gap-4 opacity-60">
               <GraduationCap size={48} />
               <p>Select a course to design its grading schema.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}