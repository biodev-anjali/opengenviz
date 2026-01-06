/** Main application component */
import React, { useState, useEffect } from 'react'
import Disclaimer from './components/Disclaimer'
import UploadPanel from './components/UploadPanel'
import FetchPanel from './components/FetchPanel'
import AnalysisPanel from './components/AnalysisPanel'
import VisualizationPanel from './components/VisualizationPanel'
import HeatmapPanel from './components/HeatmapPanel'
import SequenceComparison from './components/SequenceComparison'
import HistoryPanel from './components/HistoryPanel'
import HistoryDetail from './components/HistoryDetail'

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [currentComparison, setCurrentComparison] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedHistoryId, setSelectedHistoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load history on mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const { api } = await import('./api/client')
      const data = await api.getHistory()
      setHistory(data.analyses || [])
    } catch (err) {
      console.error('Error loading history:', err)
    }
  }

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis)
    setSelectedHistoryId(null)
    setError(null)
    loadHistory() // Refresh history
  }

  const handleComparisonComplete = (comparison) => {
    setCurrentComparison(comparison)
    setError(null)
  }

  const handleHistorySelect = async (analysisId) => {
    try {
      setLoading(true)
      setError(null)
      const { api } = await import('./api/client')
      const analysis = await api.getHistoryDetail(analysisId)
      setCurrentAnalysis(analysis)
      setSelectedHistoryId(analysisId)
      setCurrentComparison(null)
    } catch (err) {
      setError(err.userMessage || 'Error loading analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setLoading(false)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>OpenGenViz - Genomic Analysis Platform</h1>
      </header>
      
      <Disclaimer />

      {error && (
        <div className="error-message" style={{ margin: '0 2rem' }}>
          {error}
          <button onClick={clearError} style={{ float: 'right', background: 'none', border: 'none', color: '#c33', cursor: 'pointer' }}>
            ×
          </button>
        </div>
      )}

      <div className="app-content">
        <div className="app-left">
          <UploadPanel
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            setLoading={setLoading}
          />
          
          <FetchPanel
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            setLoading={setLoading}
          />

          <SequenceComparison
            history={history}
            onComparisonComplete={handleComparisonComplete}
            onError={handleError}
            setLoading={setLoading}
          />

          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            selectedId={selectedHistoryId}
            onRefresh={loadHistory}
          />
        </div>

        <div className="app-right">
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          )}

          {selectedHistoryId && currentAnalysis && (
            <HistoryDetail
              analysis={currentAnalysis}
              onReanalyze={() => setSelectedHistoryId(null)}
            />
          )}

          {!selectedHistoryId && currentAnalysis && (
            <>
              <AnalysisPanel analysis={currentAnalysis} />
              <VisualizationPanel analysis={currentAnalysis} />
              {currentAnalysis.sequence_type !== 'Protein' && (
                <HeatmapPanel analysis={currentAnalysis} />
              )}
            </>
          )}

          {currentComparison && (
            <div className="panel">
              <h2 className="panel-title">Sequence Comparison Results</h2>
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
              
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Mutations</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table">
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
                          <td>{mutation.ref}</td>
                          <td>{mutation.sample}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {currentComparison.mutation_heatmap && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Mutation Density Heatmap</h3>
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
            </div>
          )}

          {!currentAnalysis && !currentComparison && !loading && (
            <div className="panel">
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                Upload a FASTA file or fetch a sequence to begin analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

