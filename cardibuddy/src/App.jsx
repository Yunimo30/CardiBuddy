import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TrackerProvider } from "./context/TrackerContext"; 
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import ResourceHub from "./pages/ResourceHub";
import Map from "./pages/Map";

// We will build this file in the next step, but we need to import it now so the route works!
import GpaEngine from "./pages/GpaEngine"; 

export default function App() {
  return (
    <TrackerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            
            {/* FIX: Changed "resource" to "resources" to match the NavLink */}
            <Route path="resources" element={<ResourceHub />} />
            
            {/* NEW: Added the route for our upcoming GPA Engine */}
            <Route path="gpa" element={<GpaEngine />} />
            
            <Route path="map" element={<Map />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrackerProvider>
  );
}