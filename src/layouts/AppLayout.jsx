import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTracker } from "../context/TrackerContext";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Link as LinkIcon, 
  Calculator, 
  Map as MapIcon, 
  HelpCircle,
  Pin,
  PinOff,
  MousePointerClick 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HelpModal from "../components/HelpModal";

export default function AppLayout() {
  const { selectedWeek, setSelectedWeek, termConfig, sidebarMode, changeSidebarMode } = useTracker();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); 

  const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30">
      
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 flex justify-between items-center z-30 relative shrink-0">
        <div className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.02]">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 shadow-lg shadow-red-500/20 rounded-lg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" rx="90" fill="#09090B"/>
            <path d="M 120,320 L 180,90 L 260,200 Z" fill="#DC2626" />
            <path d="M 120,320 L 260,200 L 290,310 Z" fill="#991B1B" />
            <path d="M 260,200 L 350,220 L 280,260 Z" fill="#F59E0B" />
            <circle cx="215" cy="180" r="14" fill="#09090B" />
            <circle cx="218" cy="177" r="4" fill="#FFFFFF" />
          </svg>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
            CardiBuddy
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="https://github.com/Yunimo30" target="_blank" rel="noopener noreferrer" className="md:hidden text-zinc-500 hover:text-white transition-colors"><GithubIcon /></a>
          <div className="flex items-center gap-1 sm:gap-2 bg-zinc-900/50 border border-white/5 rounded-lg px-2 sm:px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:inline">Week:</span>
            <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))} className="bg-transparent text-zinc-100 text-xs sm:text-sm font-bold outline-none cursor-pointer appearance-none">
              {[...Array(termConfig.totalWeeks)].map((_, i) => (<option key={i + 1} value={i + 1} className="bg-zinc-900">Week {i + 1}</option>))}
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Rail */}
        <nav 
          className={`hidden md:flex flex-col gap-2 border-r border-white/5 bg-zinc-950/40 transition-all duration-300 ease-out z-20 shrink-0 py-4 px-3 relative
            ${sidebarMode === 'expanded' ? 'w-64' : sidebarMode === 'collapsed' ? 'w-[72px]' : 'w-[72px] hover:w-64 group'}
          `}
        >
          <div className="flex flex-col gap-2">
            <NavItem to="/" icon={<LayoutDashboard size={22} />} label="Dashboard" sidebarMode={sidebarMode} />
            <NavItem to="/schedule" icon={<CalendarDays size={22} />} label="Schedule" sidebarMode={sidebarMode} />
            <NavItem to="/resources" icon={<LinkIcon size={22} />} label="Resource Hub" sidebarMode={sidebarMode} />
            <NavItem to="/gpa" icon={<Calculator size={22} />} label="GPA Engine" sidebarMode={sidebarMode} />
            <NavItem to="/map" icon={<MapIcon size={22} />} label="Campus Map" sidebarMode={sidebarMode} />
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-1 relative">
            <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="relative">
              {isMenuOpen && (
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsMenuOpen(false)} />
              )}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative z-50 w-full flex items-center gap-4 p-3 rounded-xl font-bold transition-all duration-200 overflow-hidden whitespace-nowrap
                  ${isMenuOpen ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}
                `}
              >
                <span className="shrink-0 flex items-center justify-center">
                  {sidebarMode === 'expanded' ? <Pin size={22} className="fill-current text-white" /> : 
                   sidebarMode === 'collapsed' ? <PinOff size={22} /> : 
                   <MousePointerClick size={22} />}
                </span>
                <span className={`transition-all duration-300 ${sidebarMode === 'expanded' ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 delay-75"}`}>
                  Sidebar Control
                </span>
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute bottom-full left-0 mb-3 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 z-50"
                  >
                    <MenuOption icon={<MousePointerClick size={16} />} label="Auto Hover" isActive={sidebarMode === 'auto'} onClick={() => { changeSidebarMode('auto'); setIsMenuOpen(false); }} />
                    <MenuOption icon={<Pin size={16} />} label="Pinned Open" isActive={sidebarMode === 'expanded'} onClick={() => { changeSidebarMode('expanded'); setIsMenuOpen(false); }} />
                    <MenuOption icon={<PinOff size={16} />} label="Locked Closed" isActive={sidebarMode === 'collapsed'} onClick={() => { changeSidebarMode('collapsed'); setIsMenuOpen(false); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setIsHelpOpen(true)} className="flex items-center gap-4 p-3 rounded-xl font-bold transition-all duration-200 text-zinc-500 hover:bg-zinc-900 hover:text-white overflow-hidden whitespace-nowrap">
              <span className="shrink-0 flex items-center justify-center"><HelpCircle size={22} /></span>
              <span className={`transition-all duration-300 ${sidebarMode === 'expanded' ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 delay-75"}`}>Help & Guides</span>
            </button>
            <a href="https://github.com/Yunimo30" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl font-bold transition-all duration-200 text-zinc-500 hover:bg-zinc-900 hover:text-white overflow-hidden whitespace-nowrap">
              <span className="shrink-0 flex items-center justify-center"><GithubIcon /></span>
              <span className={`transition-all duration-300 ${sidebarMode === 'expanded' ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 delay-75"}`}>@Yunimo30</span>
            </a>
          </div>
        </nav>

        {/* Main Content Area (Notice the dynamic pb-24 added for mobile padding) */}
        <main className="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          <div className="absolute inset-0 bg-zinc-950/95 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-24 md:pb-6 custom-scrollbar absolute inset-0 z-10">
              <Outlet /> 
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. The New Floating Mobile Dock */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="flex items-center justify-between w-full max-w-sm bg-zinc-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] pointer-events-auto">
           <MobileNavItem to="/" icon={<LayoutDashboard size={20} />} label="Dash" />
           <MobileNavItem to="/schedule" icon={<CalendarDays size={20} />} label="Sched" />
           <MobileNavItem to="/resources" icon={<LinkIcon size={20} />} label="Links" />
           <MobileNavItem to="/gpa" icon={<Calculator size={20} />} label="GPA" />
           <MobileNavItem to="/map" icon={<MapIcon size={20} />} label="Map" />
        </nav>
      </div>

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}

// Sub-component for Mobile Dock Expansion
function MobileNavItem({ to, icon, label }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 ${
          isActive 
            ? "bg-red-500/15 text-red-400 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]" 
            : "text-zinc-500 hover:text-zinc-300"
        }`}>
          <span className="shrink-0">{icon}</span>
          {isActive && (
            <motion.span 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-bold overflow-hidden whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </div>
      )}
    </NavLink>
  );
}

// Desktop Menu Option
function MenuOption({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors w-full text-left ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}>
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

// Desktop NavItem
function NavItem({ to, icon, label, sidebarMode }) {
  return (
    <NavLink to={to} className={({isActive}) => `flex items-center gap-4 p-3 rounded-xl font-bold transition-all duration-200 overflow-hidden whitespace-nowrap ${isActive ? "bg-red-500/10 text-red-400 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"}`}>
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      <span className={`transition-all duration-300 ${sidebarMode === 'expanded' ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 delay-75"}`}>
        {label}
      </span>
    </NavLink>
  );
}