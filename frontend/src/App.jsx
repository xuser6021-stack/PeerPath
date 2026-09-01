import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import PathDetail from './pages/PathDetail';
import CreatePath from './pages/CreatePath';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Login from './pages/Login';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="path/:id" element={<PathDetail />} />
            <Route path="community" element={<Community />} />
            <Route path="login" element={<Login />} />

            {/* Protected Routes — require authentication */}
            <Route
              path="create"
              element={
                <ProtectedRoute>
                  <CreatePath />
                </ProtectedRoute>
              }
            />
            <Route
              path="progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
