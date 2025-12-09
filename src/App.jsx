import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Notes from './pages/Notes';
import Anniversary from './pages/Anniversary';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="m-0 p-0 min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/anniversary" element={<Anniversary />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
