import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Home } from './pages/user/Home';
import { CategoryView } from './pages/user/CategoryView';
import { BookDetails } from './pages/user/BookDetails';
import { Checkout } from './pages/user/Checkout';
import { Success } from './pages/user/Success';
import { Profile } from './pages/user/Profile';

// Updated ProtectedRoute to allow Admins to access User routes
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: 'admin' | 'user' }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" />;
  
  // Strict check for Admin routes
  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // For User routes, allow both Users and Admins
  if (role === 'user' && user.role !== 'user' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* User Routes - Now Accessible by Admin */}
            <Route path="/home" element={
              <ProtectedRoute role="user">
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/category/:category" element={
              <ProtectedRoute role="user">
                <CategoryView />
              </ProtectedRoute>
            } />
            <Route path="/book/:id" element={
              <ProtectedRoute role="user">
                <BookDetails />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute role="user">
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute role="user">
                <Success />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute role="user">
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
