import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { Layout } from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Feedback from './pages/Feedback';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Landing from './pages/Landing';

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/overview" element={<Dashboard />} /> {/* Reuse Dashboard for Mentor Overview */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chats" element={<Chats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
