import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const isAdminAuthenticated = !!localStorage.getItem("adminToken"); // Check if admin is logged in

  return (
    <Router>
      <Header />
      <div className="container mx-auto px-4">
        <Routes>
          {/* Default Home Page */}
          <Route path="/" element={<Home />} />

          {/* Category Page */}
          <Route path="/categories" element={<CategoryPage />} />

          {/* Admin Login Page */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Protected Admin Dashboard Page */}
          <Route
            path="/admin-dashboard"
            element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin" />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
