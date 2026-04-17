import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Chatbox from './components/Chatbox';
import Dashboard from './components/admin/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="bg-gray-950 text-white min-h-screen font-sans antialiased">
            <Navigation />
            <Hero />
            <Skills />
            <Projects />
            <Contact />
            <Chatbox />
          </div>
        } />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
