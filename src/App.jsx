import { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RegisterPatient from './pages/RegisterPatient';
import Patients from './pages/Patients';
import Analytics from './pages/Analytics';
import FeedbackForm from './pages/FeedbackForm';
import { INITIAL_PATIENTS } from './data/store';
import './index.css';

function AppShell() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const location = useLocation();
  const isFeedback = location.pathname.startsWith('/feedback');

  const handleRegister = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleSendLink = (id) => {
    setPatients(prev => prev.map(p =>
      p.id === id ? { ...p, linkSent: true, status: 'pending' } : p
    ));
  };

  const handleSubmitFeedback = (id, feedback) => {
    setPatients(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'responded', feedback } : p
    ));
  };

  if (isFeedback) {
    return (
      <Routes>
        <Route path="/feedback/:id" element={<FeedbackForm patients={patients} onSubmitFeedback={handleSubmitFeedback} />} />
      </Routes>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Dashboard patients={patients} onSendLink={handleSendLink} />} />
          <Route path="/register" element={<RegisterPatient onRegister={handleRegister} />} />
          <Route path="/patients" element={<Patients patients={patients} />} />
          <Route path="/analytics" element={<Analytics patients={patients} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
