import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DoctorsList from './pages/DoctorsList';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" replace />;
  
  return children;
};

const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-night-bg text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/doctors",
    element: <Layout><DoctorsList /></Layout>,
  },
  {
    path: "/login",
    element: <Layout><Login /></Layout>,
  },
  {
    path: "/register",
    element: <Layout><Register /></Layout>,
  },
  {
    path: "/patient-dashboard/*",
    element: <Layout><ProtectedRoute roleRequired="patient"><PatientDashboard /></ProtectedRoute></Layout>,
  },
  {
    path: "/doctor-dashboard/*",
    element: <Layout><ProtectedRoute roleRequired="doctor"><DoctorDashboard /></ProtectedRoute></Layout>,
  },
  {
    path: "/admin-dashboard/*",
    element: <Layout><ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute></Layout>,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;
