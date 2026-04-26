import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTracker } from "../context/TrackerContext";
import { 
  Menu, 
  LayoutDashboard, 
  CalendarDays, 
  Link as LinkIcon, 
  Calculator, 
  Map as MapIcon, 
  HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HelpModal from "../components/HelpModal";

export default function AppLayout() {
  const { selectedWeek, setSelectedWeek, termConfig } = useTracker();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const location = useLocation(); 

  // Reusable inline SVG for GitHub to bypass Vite dependency cache issues
  const GithubIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 p-4 flex justify-between items-center z-10 relative shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-red-500 tracking-tight">CardiBuddy</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile-only GitHub link in Header */}
          <a 
            href="https://github.com/Yunimo30" 
            target="_blank" 
            rel="noopener noreferrer"
            className="md:hidden text-zinc-500 hover:text-white transition-colors"
          >
            <GithubIcon />
          </a>

          <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">Planning:</span>
          <select 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="bg-zinc-950 text-zinc-100 text-sm font-bold border border-zinc-800 rounded-md px-3 py-1.5 outline-none focus:border-red-500 transition-colors shadow-sm"
          >
            {[...Array(termConfig.totalWeeks)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <nav className={`${isCollapsed ? "w-20" : "w-64"} border-r border-zinc-800 bg-zinc-900/30 p-4 hidden md:flex flex-col gap-2 transition-all duration-300 ease-in-out z-20 shrink-0`}>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isCollapsed={isCollapsed} />
          <NavItem to="/schedule" icon={<CalendarDays size={20} />} label="Schedule" isCollapsed={isCollapsed} />
          <NavItem to="/resources" icon={<LinkIcon size={20} />} label="Resource Hub" isCollapsed={isCollapsed} />
          <NavItem to="/gpa" icon={<Calculator size={20} />} label="GPA Engine" isCollapsed={isCollapsed} />
          <NavItem to="/map" icon={<MapIcon size={20} />} label="Campus Map" isCollapsed={isCollapsed} />

          {/* Bottom Sidebar Action Buttons */}
          <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-col gap-1">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg font-bold transition-all duration-200 text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            >
              <HelpCircle size={20} className="shrink-0" />
              <span className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"}`}>
                Help & Guides
              </span>
            </button>

            {/* GitHub Profile Link */}
            <a 
              href="https://github.com/Yunimo30" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 p-3 rounded-lg font-bold transition-all duration-200 text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
            >
              <GithubIcon />
              <span className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"}`}>
                @Yunimo30
              </span>
            </a>
          </div>
        </nav>

        {/* Main Content Area with Subtle Horizontal Glide Page Transitions */}
        <main className="flex-1 bg-zinc-950 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar absolute inset-0"
            >
              <Outlet /> 
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden border-t border-zinc-800 bg-zinc-900 flex justify-around p-3 z-20 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)] shrink-0">
         <NavLink to="/" className="text-zinc-400 hover:text-white p-2"><LayoutDashboard size={24} /></NavLink>
         <NavLink to="/schedule" className="text-zinc-400 hover:text-white p-2"><CalendarDays size={24} /></NavLink>
         <NavLink to="/resources" className="text-zinc-400 hover:text-white p-2"><LinkIcon size={24} /></NavLink>
         <NavLink to="/gpa" className="text-zinc-400 hover:text-white p-2"><Calculator size={24} /></NavLink>
         <NavLink to="/map" className="text-zinc-400 hover:text-white p-2"><MapIcon size={24} /></NavLink>
      </nav>

      {/* Help Modal Rendering */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

    </div>
  );
}

// Reusable NavItem Component
function NavItem({ to, icon, label, isCollapsed }) {
  return (
    <NavLink 
      to={to} 
      title={isCollapsed ? label : ""}
      className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg font-bold transition-all duration-200 overflow-hidden whitespace-nowrap ${
        isActive 
          ? "bg-zinc-800 text-white shadow-sm" 
          : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
        {label}
      </span>
    </NavLink>
  );
}