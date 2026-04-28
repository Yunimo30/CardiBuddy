import { createContext, useState, useContext, useEffect } from 'react';

const TrackerContext = createContext();

export function TrackerProvider({ children }) {
  const termConfig = {
    termName: "3rd Trimester AY 2025-2026",
    totalWeeks: 14,
    finalsWeek: 13,
    startDate: new Date("2026-04-06T00:00:00"),
    endDate: new Date("2026-07-11T23:59:59"), 
    holidays: [
      { name: "Araw ng Kagitingan", date: new Date("2026-04-09") },
      { name: "Labor Day", date: new Date("2026-05-01") },
      { name: "Independence Day", date: new Date("2026-06-12") }
    ]
  };

  // --- DYNAMIC CURRENT WEEK ENGINE ---
  const calculateCurrentWeek = () => {
    const now = new Date();
    const start = termConfig.startDate;
    const end = termConfig.endDate;

    if (now < start) return 1; 
    if (now > end) return termConfig.totalWeeks; 

    const diffInTime = now.getTime() - start.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    
    return Math.floor(diffInDays / 7) + 1;
  };

  const currentRealWeek = calculateCurrentWeek();
  const [selectedWeek, setSelectedWeek] = useState(currentRealWeek);

// --- UI PREFERENCES LOGIC ---
  const [sidebarMode, setSidebarMode] = useState(() => {
    const saved = localStorage.getItem('cardiBuddy_sidebarMode');
    return saved ? JSON.parse(saved) : 'auto'; 
  });

  // NEW: Direct setter function instead of a cycle
  const changeSidebarMode = (newMode) => {
    setSidebarMode(newMode);
    localStorage.setItem('cardiBuddy_sidebarMode', JSON.stringify(newMode));
  };


  const cycleSidebarMode = () => {
    setSidebarMode(prev => {
      // The Cycle: Auto -> Expanded -> Collapsed -> Auto
      const nextMode = prev === 'auto' ? 'expanded' : prev === 'expanded' ? 'collapsed' : 'auto';
      localStorage.setItem('cardiBuddy_sidebarMode', JSON.stringify(nextMode));
      return nextMode;
    });
  };

  // --- MODALITY & EVENTS LOGIC ---
  const [modalityOverrides, setModalityOverrides] = useState({});
  const [calendarEvents, setCalendarEvents] = useState({});

  useEffect(() => {
    const savedModalities = localStorage.getItem('cardiBuddy_modalities');
    if (savedModalities) {
      setModalityOverrides(JSON.parse(savedModalities));
    }

    const savedEvents = localStorage.getItem('cardiBuddy_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        const migrated = {};
        for (const date in parsed) {
          migrated[date] = parsed[date].map((ev, idx) => 
            typeof ev === 'string' 
              ? { id: `legacy-${idx}-${Date.now()}`, text: ev, completed: false } 
              : ev
          );
        }
        setCalendarEvents(migrated);
      } catch (e) {
        console.error("Failed to parse events", e);
      }
    }
  }, []);

  const toggleModality = (weekNumber) => {
    setModalityOverrides(prev => {
      const currentModality = prev[weekNumber] || "F2F";
      const newModality = currentModality === "F2F" ? "Online" : "F2F";
      const newState = { ...prev, [weekNumber]: newModality };
      localStorage.setItem('cardiBuddy_modalities', JSON.stringify(newState));
      return newState;
    });
  };

  const getModalityForWeek = (weekNumber) => {
    return modalityOverrides[weekNumber] || "F2F";
  };

  const addEvent = (dateString, eventText) => {
    setCalendarEvents(prev => {
      const existing = prev[dateString] || [];
      const newEvent = {
        id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        text: eventText,
        completed: false
      };
      const newState = { ...prev, [dateString]: [...existing, newEvent] };
      localStorage.setItem('cardiBuddy_events', JSON.stringify(newState));
      return newState;
    });
  };

  const toggleEventCompletion = (dateString, eventId) => {
    setCalendarEvents(prev => {
      if (!prev[dateString]) return prev;
      const updatedEvents = prev[dateString].map(ev => 
        ev.id === eventId ? { ...ev, completed: !ev.completed } : ev
      );
      const newState = { ...prev, [dateString]: updatedEvents };
      localStorage.setItem('cardiBuddy_events', JSON.stringify(newState));
      return newState;
    });
  };

  // --- SCHEDULE LOGIC ---
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const savedClasses = localStorage.getItem('cardiBuddy_classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  const saveClass = (newClass) => {
    setClasses(prev => {
      const newState = [...prev, newClass];
      localStorage.setItem('cardiBuddy_classes', JSON.stringify(newState));
      return newState;
    });
  };

  const updateClass = (updatedClass) => {
    setClasses(prev => {
      const newState = prev.map(c => c.id === updatedClass.id ? updatedClass : c);
      localStorage.setItem('cardiBuddy_classes', JSON.stringify(newState));
      return newState;
    });
  };

  const deleteClass = (id) => {
    setClasses(prev => {
      const newState = prev.filter(c => c.id !== id);
      localStorage.setItem('cardiBuddy_classes', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <TrackerContext.Provider value={{ 
        selectedWeek, 
        setSelectedWeek, 
        currentRealWeek, 
        termConfig,
        changeSidebarMode,
        sidebarMode,
        getModalityForWeek,
        toggleModality,
        calendarEvents,
        setCalendarEvents,
        addEvent,
        toggleEventCompletion,
        classes,
        saveClass,
        deleteClass,
        updateClass
    }}>
      {children}
    </TrackerContext.Provider>
  );
}

export const useTracker = () => useContext(TrackerContext);