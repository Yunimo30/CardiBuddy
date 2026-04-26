import { createContext, useState, useContext, useEffect } from 'react';

const TrackerContext = createContext();

export function TrackerProvider({ children }) {
  const currentRealWeek = 3; 
  const [selectedWeek, setSelectedWeek] = useState(currentRealWeek);
  
  // State to hold user's manual modality overrides
  const [modalityOverrides, setModalityOverrides] = useState({});

  // --- CALENDAR EVENTS LOGIC ---
  const [calendarEvents, setCalendarEvents] = useState({});

  const termConfig = {
    termName: "3rd Trimester AY 2025-2026",
    totalWeeks: 14,
    finalsWeek: 13,
    // Add exact dates for the math engine
    startDate: new Date("2026-04-06T00:00:00"),
    endDate: new Date("2026-07-11T23:59:59"), 
    holidays: [
      { name: "Araw ng Kagitingan", date: new Date("2026-04-09") },
      { name: "Labor Day", date: new Date("2026-05-01") },
      { name: "Independence Day", date: new Date("2026-06-12") }
    ]
  };

  // Load saved modalities from LocalStorage when the app starts
  useEffect(() => {
    const saved = localStorage.getItem('cardiBuddy_modalities');
    if (saved) {
      setModalityOverrides(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const savedEvents = localStorage.getItem('cardiBuddy_events');
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        // Migration: Convert old plain-text arrays into object arrays
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

  // Function to toggle and save the modality for a specific week
  const toggleModality = (weekNumber) => {
    setModalityOverrides(prev => {
      // If it's currently F2F (default/undefined), make it Online. Otherwise, revert to F2F.
      const currentModality = prev[weekNumber] || "F2F";
      const newModality = currentModality === "F2F" ? "Online" : "F2F";
      
      const newState = { ...prev, [weekNumber]: newModality };
      localStorage.setItem('cardiBuddy_modalities', JSON.stringify(newState));
      return newState;
    });
  };

  // Helper to get the modality for any week (Defaults to F2F)
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
    // Purged the 'else' block containing the mock Mapua data.
    // New users will now see the beautiful empty states we built!
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