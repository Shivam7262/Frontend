import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import AddDestination from './pages/AddDestination';
import EditDestination from './pages/EditDestination';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatBot from './components/ChatBot';
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="pt-14 md:pt-16 pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/new" element={<ProtectedRoute requiredRole="ADMIN"><AddDestination /></ProtectedRoute>} />
                <Route path="/destinations/:id" element={<DestinationDetail />} />
                <Route path="/destinations/:id/edit" element={<ProtectedRoute requiredRole="ADMIN"><EditDestination /></ProtectedRoute>} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                {/* Blogs removed */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            <ChatBot />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
