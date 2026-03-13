import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Use the existing or create simple wrappers for pages
import HomePage from './pages/HomePage';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import HistoryPage from './pages/HistoryPage';
import StrengthCheckerPage from './pages/StrengthCheckerPage';
import PassphraseGeneratorPage from './pages/PassphraseGeneratorPage';
import UsernameGeneratorPage from './pages/UsernameGeneratorPage';
import QRCodeSharePage from './pages/QRCodeSharePage';
import FunPasswordModePage from './pages/FunPasswordModePage';
import PatternPasswordGeneratorPage from './pages/PatternPasswordGeneratorPage';
import SmartPasswordGeneratorPage from './pages/SmartPasswordGeneratorPage';
import CrackTimeEstimatorPage from './pages/CrackTimeEstimatorPage';
import PinGeneratorPage from './pages/PinGeneratorPage';
import PasswordMutationPage from './pages/PasswordMutationPage';
import PasswordMemoryScorePage from './pages/PasswordMemoryScorePage';
import PasswordRotationPage from './pages/PasswordRotationPage';

function App() {
  return (
    <div className="app-shell">
      <div className="background-layer" aria-hidden="true">
        <span className="glow-blob blob-a" />
        <span className="glow-blob blob-b" />
        <span className="glow-blob blob-c" />
      </div>

      <div className="app-layout">
        <Navbar />

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


