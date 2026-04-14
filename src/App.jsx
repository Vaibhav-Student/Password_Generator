import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import HistoryPage from './pages/HistoryPage';
import StrengthCheckerPage from './pages/StrengthCheckerPage';
import PassphraseGeneratorPage from './pages/PassphraseGeneratorPage';
import UsernameGeneratorPage from './pages/UsernameGeneratorPage';
import QRCodeSharePage from './pages/QRCodeSharePage';
import QRCodeExtractorPage from './pages/QRCodeExtractorPage';
import FunPasswordModePage from './pages/FunPasswordModePage';
import PatternPasswordGeneratorPage from './pages/PatternPasswordGeneratorPage';
import SmartPasswordGeneratorPage from './pages/SmartPasswordGeneratorPage';
import CrackTimeEstimatorPage from './pages/CrackTimeEstimatorPage';
import PinGeneratorPage from './pages/PinGeneratorPage';
import PasswordMutationPage from './pages/PasswordMutationPage';
import PasswordMemoryScorePage from './pages/PasswordMemoryScorePage';
import PasswordRotationPage from './pages/PasswordRotationPage';

function App() {
  const { pathname } = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
    };

    let animId;
    const animate = () => {
      const lerp = 0.12;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="cursor-dot" ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
        />

        <div className="content-shell">
          <main className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generator" element={<PasswordGeneratorPage />} />
              <Route path="/pattern-generator" element={<PatternPasswordGeneratorPage />} />
              <Route path="/smart-generator" element={<SmartPasswordGeneratorPage />} />
              <Route path="/passphrase" element={<PassphraseGeneratorPage />} />
              <Route path="/fun-password" element={<FunPasswordModePage />} />
              <Route path="/usernames" element={<UsernameGeneratorPage />} />
              <Route path="/qr-share" element={<QRCodeSharePage />} />
              <Route path="/qr-extractor" element={<QRCodeExtractorPage />} />
              <Route path="/analyzer" element={<StrengthCheckerPage />} />
              <Route path="/crack-time" element={<CrackTimeEstimatorPage />} />
              <Route path="/pin-generator" element={<PinGeneratorPage />} />
              <Route path="/mutation-tool" element={<PasswordMutationPage />} />
              <Route path="/memory-score" element={<PasswordMemoryScorePage />} />
              <Route path="/rotation-generator" element={<PasswordRotationPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
