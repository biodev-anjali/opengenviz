/** Analysis page - main workflow for sequence analysis */
import React, { useState } from 'react'
import Layout from '../components/Layout'
import UploadPanel from '../components/UploadPanel'
import FetchPanel from '../components/FetchPanel'
import AnalysisPanel from '../components/AnalysisPanel'
import VisualizationPanel from '../components/VisualizationPanel'
import HeatmapPanel from '../components/HeatmapPanel'

const AnalysisPage = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis)
    setError(null)
    // Note: History is automatically updated on backend, will be visible in History page
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setLoading(false)
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
          <h2 className="page-title">Sequence Analysis</h2>
          <p className="page-subtitle">Upload a FASTA file or fetch from public databases to analyze DNA, RNA, or protein sequences</p>
        </div>

        <div className="analysis-layout">
          <div className="analysis-left">
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
          </div>

          <div className="analysis-right">
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            )}

            {currentAnalysis ? (
              <>
                <AnalysisPanel analysis={currentAnalysis} />
                <VisualizationPanel analysis={currentAnalysis} />
                {currentAnalysis.sequence_type !== 'Protein' && (
                  <HeatmapPanel analysis={currentAnalysis} />
                )}
              </>
            ) : (
              <div className="panel">
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  Upload a FASTA file or fetch a sequence to begin analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AnalysisPage

