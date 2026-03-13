import { formatHistoryTime } from '../utils/passwordUtils';

function HistoryList({ items, onCopy, onDelete }) {
  if (!items.length) {
    return <p className="history-empty">No passwords yet. Generate one to get started.</p>;
  }

  return (
    <ul className="history-list">
      {items.map((item) => (
        <li key={item.id}>
          <div className="history-meta">
            <code>{item.password}</code>
            <small>{formatHistoryTime(item.createdAt)}</small>
          </div>
          <div className="history-actions">
            <button type="button" className="icon-btn tiny" onClick={() => onCopy(item.password)} aria-label="Copy password">
              <svg viewBox="0 0 24 24" fill="none" role="presentation">
                <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" className="icon-btn tiny danger" onClick={() => onDelete(item.id)} aria-label="Delete password">
              <svg viewBox="0 0 24 24" fill="none" role="presentation">
                <path d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default HistoryList;