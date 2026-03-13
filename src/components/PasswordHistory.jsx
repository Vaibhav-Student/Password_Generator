function PasswordHistory({ history, onCopy, onDelete, onClear, formatTime }) {
  return (
    <section className="history-card glass-panel" id="history">
      <div className="section-head">
        <h3>Password History</h3>
        <button type="button" className="text-btn" onClick={onClear} disabled={!history.length}>
          Clear History
        </button>
      </div>

      {history.length ? (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id}>
              <div className="history-meta">
                <code>{item.password}</code>
                <small>{formatTime(item.createdAt)}</small>
              </div>

              <div className="history-actions">
                <button type="button" className="icon-btn tiny" onClick={() => onCopy(item.password)} aria-label="Copy password">
                  <svg viewBox="0 0 24 24" fill="none" role="presentation">
                    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
      ) : (
        <p className="history-empty">Generated passwords will appear here.</p>
      )}
    </section>
  );
}

export default PasswordHistory;