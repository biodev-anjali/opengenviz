/** Comparison page - dedicated page for sequence comparison */
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import HeatmapPanel from '../components/HeatmapPanel'
import { api } from '../api/client'

const ComparisonPage = () => {
  const [history, setHistory] = useState([])
  const [referenceId, setReferenceId] = useState('')
  const [sampleId, setSampleId] = useState('')
  const [currentComparison, setCurrentComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await api.getHistory()
      setHistory(data.analyses || [])
    } catch (err) {
      console.error('Error loading history:', err)
    }
  }

  const handleCompare = async () => {
    const refId = parseInt(referenceId)
    const sampId = parseInt(sampleId)

    if (!refId || !sampId) {
      setError('Please select both reference and sample sequences')
      return
    }

    if (refId === sampId) {
      setError('Reference and sample must be different sequences')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await api.compareSequences(refId, sampId)
      setCurrentComparison(result)
    } catch (err) {
      setError(err.userMessage || 'Error comparing sequences')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
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
          <h2 className="page-title">Sequence Comparison</h2>
          <p className="page-subtitle">Compare two sequences to detect mutations, insertions, and deletions</p>
        </div>

        <div className="comparison-layout">
          <div className="comparison-input">
            <div className="panel">
              <h3 className="panel-title">Select Sequences</h3>
              
              <div className="form-group">
                <label>Reference Sequence</label>
                <select
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  <option value="">Select reference sequence...</option>
                  {history.map((item) => (
                    <option key={item.id} value={item.id}>
                      ID {item.id} - {item.sequence_type} ({item.sequence_length.toLocaleString()} bp)
                      {item.source_identifier && ` - ${item.source_identifier}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sample Sequence</label>
                <select
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  <option value="">Select sample sequence...</option>
                  {history.map((item) => (
                    <option key={item.id} value={item.id}>
                      ID {item.id} - {item.sequence_type} ({item.sequence_length.toLocaleString()} bp)
                      {item.source_identifier && ` - ${item.source_identifier}`}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCompare}
                disabled={!referenceId || !sampleId || loading}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {loading ? 'Comparing...' : 'Compare Sequences'}
              </button>

              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                Select two sequences from your analysis history to compare and detect mutations.
                If you don't have sequences yet, go to the <strong>Analysis</strong> page to upload or fetch sequences first.
              </p>
            </div>
          </div>

          <div className="comparison-results">
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            )}

            {currentComparison ? (
              <>
                <div className="panel">
                  <h2 className="panel-title">Comparison Results</h2>
                  
                  <div className="analysis-metrics">
                    <div className="metric-card">
                      <div className="metric-label">Total Mutations</div>
                      <div className="metric-value">{currentComparison.mutation_count}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Substitutions</div>
                      <div className="metric-value">{currentComparison.substitution_count}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Insertions</div>
                      <div className="metric-value">{currentComparison.insertion_count}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Deletions</div>
                      <div className="metric-value">{currentComparison.deletion_count}</div>
                    </div>
                  </div>

                  {currentComparison.alignment && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h3 style={{ marginBottom: '1rem' }}>Alignment Statistics</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                          <strong>Alignment Score:</strong> {currentComparison.alignment.score?.toFixed(2) || 'N/A'}
                        </div>
                        <div>
                          <strong>Identity:</strong> {currentComparison.alignment.identity?.toFixed(2) || 'N/A'}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="panel">
                  <h3 className="panel-title">Mutation List</h3>
                  <div className="mutation-list-container">
                    <table className="table mutation-table">
                      <thead>
                        <tr>
                          <th>Position</th>
                          <th>Type</th>
                          <th>Reference</th>
                          <th>Sample</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentComparison.mutations.map((mutation, idx) => (
                          <tr key={idx}>
                            <td>{mutation.position}</td>
                            <td>
                              <span className={`mutation-type ${mutation.type}`}>
                                {mutation.type}
                              </span>
                            </td>
                            <td className="monospace-cell">{mutation.ref}</td>
                            <td className="monospace-cell">{mutation.sample}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {currentComparison.mutation_heatmap && (
                  <div className="panel">
                    <h3 className="panel-title">Mutation Density Heatmap</h3>
                    <HeatmapPanel
                      analysis={{
                        visualization_data: {
                          heatmap: currentComparison.mutation_heatmap
                        },
                        sequence_type: 'DNA'
                      }}
                      isMutationHeatmap={true}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="panel">
                <div className="empty-state">
                  <div className="empty-state-icon">🔬</div>
                  <h3 className="empty-state-title">Ready to Compare</h3>
                  <p className="empty-state-description">
                    Select a reference and sample sequence from your analysis history to detect mutations and variations.
                  </p>
                  {history.length === 0 && (
                    <div className="empty-state-steps" style={{ marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        <strong>No sequences available yet.</strong> Go to the <strong>Analysis</strong> page to analyze sequences first.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ComparisonPage

