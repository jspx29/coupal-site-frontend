import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import Landing from './pages/Landing';
import Notes from './pages/Notes';
import Anniversary from './pages/Anniversary';
import About from './pages/About';
import NewYearLetter from './pages/NewYearLetter';
import Tracker from './pages/Tracker';

function AppContent() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100" />
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/anniversary" element={<Anniversary />} />
        <Route path="/about" element={<About />} />
        <Route path="/newyear" element={<NewYearLetter />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
