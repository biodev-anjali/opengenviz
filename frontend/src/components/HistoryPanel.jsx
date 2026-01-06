/** History panel component */
import React from 'react'

const HistoryPanel = ({ history, onSelect, selectedId, onRefresh }) => {
  if (!history || history.length === 0) {
    return (
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="panel-title" style={{ margin: 0 }}>History</h2>
          <button
            className="btn btn-secondary"
            onClick={onRefresh}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Refresh
          </button>
        </div>
        <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
          No analysis history yet.
        </p>
      </div>
    )
  }

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="panel-title" style={{ margin: 0 }}>History ({history.length})</h2>
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Refresh
        </button>
      </div>
      
      <div className="history-list">
        {history.map((item) => (
          <div
            key={item.id}
            className={`history-item ${selectedId === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}
            style={{
              backgroundColor: selectedId === item.id ? '#e3f2fd' : 'transparent',
            }}
          >
            <div className="history-item-header">
              <div>
                <span className={`history-item-type ${item.sequence_type.toLowerCase()}`}>
                  {item.sequence_type}
                </span>
                <strong style={{ marginLeft: '0.5rem' }}>ID: {item.id}</strong>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                {item.sequence_length.toLocaleString()} bp
              </span>
            </div>
            {item.source_identifier && (
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                {item.source_identifier}
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
              {new Date(item.created_at).toLocaleString()}
            </div>
            {item.gc_percent !== null && item.gc_percent !== undefined && (
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                GC%: {item.gc_percent.toFixed(2)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPanel

