import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

import HomePage from './components/HomePage';
import DetailsPage from './components/DetailsPage';
import Register from './components/Register';
import Login from './components/Login';
import CategoriesPage from './components/CategoriesPage';
import AboutUsPage from './components/AboutUsPage';
import NavBar from './components/NavBar';
import NavAndSidebar from './components/NavAndSidebar';
import NavSidebar from './components/NavSidebar';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route
            path="/account/farmer/*"
            element={<ProtectedRoute element={<NavAndSidebar />} />}
          />
          <Route
            path="/account/consumer/*"
            element={<ProtectedRoute element={<NavSidebar />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
