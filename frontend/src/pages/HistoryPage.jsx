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
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await api.getHistory()
      // Sort by newest first (most recent created_at)
      const sorted = (data.analyses || []).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
      setHistory(sorted)
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
      setSuccessMessage(null)
      const analysis = await api.getHistoryDetail(analysisId)
      setSelectedAnalysis(analysis)
      setSuccessMessage(`Analysis #${analysisId} loaded successfully`)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
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
        <div className="error-message">
          {error}
          <button onClick={clearError} className="error-close-btn" aria-label="Close error">
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          ✓ {successMessage}
        </div>
      )}

      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Analysis History</h2>
          <p className="page-subtitle">View and replay previous sequence analyses</p>
        </div>

        {selectedAnalysis ? (
          <div className="history-detail-view">
            <div className="history-back-button">
              <button
                className="btn btn-secondary"
                onClick={handleBackToList}
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
              <div className="history-header">
                <h3 className="panel-title">
                  Previous Analyses ({history.length})
                </h3>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={loadHistory}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {loading && history.length === 0 ? (
                <div className="loading">
                  <div className="spinner"></div>
                </div>
              ) : history.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <h3 className="empty-state-title">No Analysis History</h3>
                  <p className="empty-state-description">
                    Your previous analyses will appear here. Get started by analyzing your first sequence.
                  </p>
                  <div className="empty-state-steps">
                    <div className="step-item">
                      <span className="step-number">1</span>
                      <span>Go to the <strong>Analysis</strong> page</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">2</span>
                      <span>Upload or fetch a sequence</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">3</span>
                      <span>View your analysis history here</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="history-table-container">
                    <table className="table history-table">
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
                                <span className="table-muted">{item.source_type}</span>
                              )}
                            </td>
                            <td className="table-date">
                              {new Date(item.created_at).toLocaleString()}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSelect(item.id)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="history-cards">
                    {history.map((item) => (
                      <div key={item.id} className="history-card">
                        <div className="history-card-header">
                          <div>
                            <span className={`history-item-type ${item.sequence_type.toLowerCase()}`}>
                              {item.sequence_type}
                            </span>
                            <strong style={{ marginLeft: '0.5rem' }}>ID: {item.id}</strong>
                          </div>
                        </div>
                        <div className="history-card-body">
                          <div className="history-card-row">
                            <span className="history-card-label">Length:</span>
                            <span>{item.sequence_length.toLocaleString()} bp</span>
                          </div>
                          {item.gc_percent !== null && item.gc_percent !== undefined && (
                            <div className="history-card-row">
                              <span className="history-card-label">GC%:</span>
                              <span>{item.gc_percent.toFixed(2)}%</span>
                            </div>
                          )}
                          <div className="history-card-row">
                            <span className="history-card-label">Source:</span>
                            <span>{item.source_identifier || item.source_type}</span>
                          </div>
                          <div className="history-card-row">
                            <span className="history-card-label">Created:</span>
                            <span className="history-card-date">
                              {new Date(item.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="history-card-footer">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSelect(item.id)}
                          >
                            View Analysis
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HistoryPage

