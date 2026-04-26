import WeekDisplayCard from "../components/WeekDisplayCard";
import ProgressBar from "../components/ProgressBar";
import CountdownCard from "../components/CountdownCard";
import PlanningBoard from "../components/PlanningBoard"; // Import the new board

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden space-y-6 pb-20 sm:pb-6 custom-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left Panel (Status) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <WeekDisplayCard />
          <ProgressBar />
          <CountdownCard />
        </div>

        {/* Right Panel (Planning) */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px]">
          <PlanningBoard />
        </div>

      </div>
    </div>
  );
}