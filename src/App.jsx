import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TrackerProvider } from "./context/TrackerContext"; 
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import ResourceHub from "./pages/ResourceHub";
import Map from "./pages/Map";
import GpaEngine from "./pages/GpaEngine"; 

export default function App() {
  return (
    <TrackerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="resources" element={<ResourceHub />} />
            <Route path="gpa" element={<GpaEngine />} />
            <Route path="map" element={<Map />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrackerProvider>
  );
}