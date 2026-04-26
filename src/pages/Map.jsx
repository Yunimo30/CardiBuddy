import { ShieldAlert, Map as MapIcon, Lock } from "lucide-react";

export default function Map() {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500 p-4">
      
      <div className="bg-zinc-900 border border-zinc-800 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Iconography */}
        <div className="relative mb-6">
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-inner">
            <MapIcon size={48} className="text-zinc-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-600 p-1.5 rounded-lg shadow-lg border border-red-500">
            <Lock size={16} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
          Campus Map Unavailable for now...
        </h2>
        
        <div className="w-12 h-1 bg-red-600 rounded-full mb-6"></div>

        <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6">
          Public access to the interactive campus map is currently disabled. This module integrates closely with internal safety protocols and contains sensitive emergency evacuation plans.
        </p>

        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-left w-full">
          <ShieldAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Clearance Required</h4>
            <p className="text-xs text-red-400/80 leading-tight">
              Access is strictly limited to authorized administrative personnel and active on-campus security routing.
            </p>
          </div>
        </div>

      </div>
      
    </div>
  );
}