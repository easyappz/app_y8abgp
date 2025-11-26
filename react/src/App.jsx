import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import Navbar from './components/Layout/Navbar';
import Feed from './components/Feed/Feed';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Settings from './components/Profile/Settings';

function App() {
  /** Никогда не удаляй этот код */
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      /** Нужно передавать список существующих роутов */
      window.handleRoutes(['/', '/login', '/register', '/profile/:id', '/settings']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected/Main Layout Routes */}
        <Route path="*" element={
          <div className="app-layout">
            <Navbar />
            <div style={{ marginTop: '20px' }}>
              <Routes>
                <Route path="/" element={
                  <div className="container">
                    <Feed />
                  </div>
                } />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
