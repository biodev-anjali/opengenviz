/** History page - dedicated page for viewing analysis history */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import HistoryDetail from '../components/HistoryDetail'
import { api } from '../api/client'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await api.getHistory()
      setHistory(data.analyses || [])
    } catch (err) {
      setError(err.userMessage || 'Error loading history')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (analysisId) => {
    try {
      setLoading(true)
      setError(null)
      const analysis = await api.getHistoryDetail(analysisId)
      setSelectedAnalysis(analysis)
    } catch (err) {
      setError(err.userMessage || 'Error loading analysis')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const handleBackToList = () => {
    setSelectedAnalysis(null)
  }

  return (
    <Layout>
      {error && (
        <div className="error-message" style={{ margin: '0 2rem' }}>
          {error}
          <button onClick={clearError} style={{ float: 'right', background: 'none', border: 'none', color: '#c33', cursor: 'pointer' }}>
            ×
          </button>
        </div>
      )}

      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Analysis History</h2>
          <p className="page-subtitle">View and replay previous sequence analyses</p>
        </div>

        {selectedAnalysis ? (
          <div className="history-detail-view">
            <div style={{ marginBottom: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={handleBackToList}
                style={{ padding: '0.5rem 1rem' }}
              >
                ← Back to History List
              </button>
            </div>
            <HistoryDetail
              analysis={selectedAnalysis}
              onReanalyze={handleBackToList}
            />
          </div>
        ) : (
          <div className="history-list-view">
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="panel-title" style={{ margin: 0 }}>
                  Previous Analyses ({history.length})
                </h3>
                <button
                  className="btn btn-secondary"
                  onClick={loadHistory}
                  disabled={loading}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loading && history.length === 0 ? (
                <div className="loading">
                  <div className="spinner"></div>
                </div>
              ) : history.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No analysis history yet. Go to the <strong>Analysis</strong> page to analyze your first sequence.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Length</th>
                        <th>GC%</th>
                        <th>Source</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td><strong>{item.id}</strong></td>
                          <td>
                            <span className={`history-item-type ${item.sequence_type.toLowerCase()}`}>
                              {item.sequence_type}
                            </span>
                          </td>
                          <td>{item.sequence_length.toLocaleString()} bp</td>
                          <td>
                            {item.gc_percent !== null && item.gc_percent !== undefined
                              ? `${item.gc_percent.toFixed(2)}%`
                              : 'N/A'}
                          </td>
                          <td>
                            {item.source_identifier || (
                              <span style={{ color: '#999' }}>{item.source_type}</span>
                            )}
                          </td>
                          <td style={{ fontSize: '0.85rem', color: '#666' }}>
                            {new Date(item.created_at).toLocaleString()}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleSelect(item.id)}
                              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HistoryPage

