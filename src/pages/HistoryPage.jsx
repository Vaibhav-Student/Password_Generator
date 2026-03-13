import { useEffect, useState } from 'react';
import PasswordHistory from '../components/PasswordHistory';
import { copyText, formatHistoryTime } from '../utils/passwordUtils';

const HISTORY_KEY = 'securepass-history-premium-v1';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse history', e);
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 1700);
  };

  const handleCopyHistory = async (value) => {
    const copied = await copyText(value);
    showToast(copied ? 'Password Copied' : 'Copy failed');
  };

  const handleDeleteHistory = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    showToast('History cleared');
  };

  return (
    <div className="generator-section">
      <div className="generator-stack">
        <PasswordHistory
          history={history}
          onCopy={handleCopyHistory}
          onDelete={handleDeleteHistory}
          onClear={handleClearHistory}
          formatTime={formatHistoryTime}
        />
        {toast && <div className="toast" style={{ position: 'fixed', bottom: '20px', right: '20px', top: 'auto', zIndex: 999 }}>{toast}</div>}
      </div>
    </div>
  );
}

export default HistoryPage;