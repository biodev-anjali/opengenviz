/** Analysis page - main workflow for sequence analysis */
import React, { useState } from 'react'
import Layout from '../components/Layout'
import UploadPanel from '../components/UploadPanel'
import FetchPanel from '../components/FetchPanel'
import AnalysisPanel from '../components/AnalysisPanel'
import VisualizationPanel from '../components/VisualizationPanel'
import HeatmapPanel from '../components/HeatmapPanel'
import SkeletonLoader from '../components/SkeletonLoader'

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
        <div className="error-message">
          {error}
          <button onClick={clearError} className="error-close-btn" aria-label="Close error">
            ×
          </button>
        </div>
      )}

      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Sequence Analysis</h2>
          <p className="page-subtitle">
            OpenGenViz is a web-based platform for genomics and bioinformatics researchers. 
            Analyze DNA, RNA, and protein sequences without installing software or using command-line tools. 
            All analyses are automatically saved with complete reproducibility.
          </p>
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
              <>
                <SkeletonLoader type="card" />
                <SkeletonLoader type="chart" />
                <SkeletonLoader type="chart" />
              </>
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
                <div className="empty-state">
                  <div className="empty-state-icon">🧬</div>
                  <h3 className="empty-state-title">For Genomics and Bioinformatics Researchers</h3>
                  <p className="empty-state-description">
                    OpenGenViz solves the problem of accessing sequence analysis tools without command-line expertise or local software installation. 
                    Unlike desktop tools that require setup, or command-line tools that need technical knowledge, this platform runs entirely in your browser.
                  </p>
                  <p className="empty-state-description" style={{ marginTop: '1rem' }}>
                    <strong>What makes this different:</strong> Every analysis is automatically saved with full metadata. 
                    You can replay any previous analysis, share results with exact reproducibility, and compare sequences 
                    with integrated mutation detection—all without managing files or remembering command syntax.
                  </p>
                  <div className="empty-state-steps">
                    <div className="step-item">
                      <span className="step-number">1</span>
                      <span>Upload a FASTA file or fetch from NCBI/EMBL databases</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">2</span>
                      <span>Automatic sequence type detection and analysis</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">3</span>
                      <span>View results, visualizations, and access full analysis history</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AnalysisPage

