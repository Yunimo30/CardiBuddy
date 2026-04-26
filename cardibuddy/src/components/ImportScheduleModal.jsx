import { useState } from "react";
import { useTracker } from "../context/TrackerContext";
import { X, ClipboardPaste, AlertCircle, FileSpreadsheet, ArrowRight } from "lucide-react";

export default function ImportScheduleModal({ onClose }) {
  const { saveClass } = useTracker();
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [successCount, setSuccessCount] = useState(0);

  const colors = ["blue", "emerald", "rose", "amber", "purple", "zinc"];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  // Helper to convert "02:00PM" to "14:00"
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "00:00";
    time12h = time12h.replace(/\s+/g, '').toUpperCase(); // Clean any weird spaces
    const modifier = time12h.slice(-2);
    let [hours, minutes] = time12h.slice(0, -2).split(":");
    if (!minutes) return "00:00";
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  };

  // Custom TSV (Tab-Separated Values) Parser
  // Safely splits columns by \t and rows by \n, respecting internal quotes
  const parseTSV = (text) => {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === '\t' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
    }
    return rows;
  };

  const handleImport = () => {
    setError("");
    setSuccessCount(0);
    
    if (!rawText.trim()) {
      setError("Please paste your schedule text first.");
      return;
    }

    try {
      // 1. Run our raw text through the TSV processor
      const rows = parseTSV(rawText);
      let parsedClasses = [];
      let addedCourses = new Set(); 

      // 2. Loop through the parsed rows
      for (let r = 0; r < rows.length; r++) {
        const columns = rows[r];
        
        // We need at least the Time column and one day column
        if (columns.length < 2) continue;

        // Check if the first column (Time) contains AM or PM
        const timeCell = columns[0].toUpperCase();
        if (timeCell.includes("AM") || timeCell.includes("PM")) {
          
          // Extract the Start and End times
          const timeMatch = timeCell.match(/(\d{1,2}:\d{2}[AP]M)/g);
          if (!timeMatch || timeMatch.length < 2) continue;

          const startTime = convertTo24Hour(timeMatch[0]);
          const endTime = convertTo24Hour(timeMatch[1]);

          // Loop through Columns 1 (Monday) to 7 (Sunday)
          for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
            const cellContent = columns[dayIndex];
            
            // If the cell has data, we have a class!
            if (cellContent && cellContent.length > 3) {
              
              // Split the cell content by line breaks
              const cellLines = cellContent.split('\n').map(s => s.trim()).filter(Boolean);
              
              const courseCode = cellLines[0] || "UNKNOWN";
              const section = cellLines[1] || "";
              // Combine the remaining lines for the room/modality
              const room = cellLines.slice(2).join(" ") || "TBA"; 
              
              const isOnline = room.toUpperCase().includes("ONLINE");
              
              // Map columns to our internal day engine (1=Mon ... 7=Sun -> 0)
              const mappedDay = dayIndex === 7 ? 0 : dayIndex;
              const uniqueKey = `${courseCode}-${mappedDay}-${startTime}`;

              if (!addedCourses.has(uniqueKey)) {
                parsedClasses.push({
                  id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  code: courseCode,
                  title: section ? `Section: ${section}` : "Imported Class",
                  room: room,
                  type: isOnline ? "Online" : "F2F",
                  days: [mappedDay],
                  startTime: startTime,
                  endTime: endTime,
                  color: getRandomColor()
                });
                addedCourses.add(uniqueKey);
              }
            }
          }
        }
      }

      if (parsedClasses.length === 0) {
        setError("Could not detect the grid format. Ensure you pasted it into a Spreadsheet first, then copied it here.");
        return;
      }

      parsedClasses.forEach(cls => saveClass(cls));
      setSuccessCount(parsedClasses.length);
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError("An error occurred while parsing. Please check the text format.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-2xl shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h3 className="font-bold text-xl text-white mb-4 tracking-tight flex items-center gap-2">
          <ClipboardPaste size={20} className="text-red-500" /> Smart Import
        </h3>
        
        {/* Updated Visual Instructions */}
        <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 mb-6 flex flex-col gap-3">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
             The Spreadsheet Bypass Method
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium">
             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs">1</span>
             Copy schedule from Portal
             <ArrowRight size={14} className="text-zinc-600" />
             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs"><FileSpreadsheet size={12}/></span>
             Paste into Excel/Sheets
             <ArrowRight size={14} className="text-zinc-600" />
             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs">3</span>
             Copy from Spreadsheet & Paste below
          </div>
        </div>

        <textarea 
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste spreadsheet data here..."
          className="w-full h-48 bg-zinc-950 border border-zinc-700 rounded-lg p-4 text-xs text-zinc-300 focus:outline-none focus:border-red-500 transition-colors custom-scrollbar resize-none font-mono whitespace-pre"
        />

        {error && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        
        {successCount > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 font-bold">
            Successfully imported {successCount} classes! Formatting your grid...
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={handleImport}
            className="bg-white text-zinc-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Process & Import
          </button>
        </div>

      </div>
    </div>
  );
}