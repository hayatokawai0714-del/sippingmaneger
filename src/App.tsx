import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { CalendarPage } from './pages/CalendarPage';
import { TodayPage } from './pages/TodayPage';
import { RegisterPage } from './pages/RegisterPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { UnitsPage } from './pages/UnitsPage';
import { DataPage } from './pages/DataPage';
import { AboutPage } from './pages/AboutPage';

export const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
