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
          <h2 className="page-title">OpenGenViz</h2>
          <p className="page-subtitle">
            A web-based platform for genomics and bioinformatics researchers to analyze DNA, RNA, and protein sequences. 
            No installation required. Automatic sequence type detection, interactive visualizations, and complete analysis history for reproducibility.
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
                  <h3 className="empty-state-title">Get Started with Sequence Analysis</h3>
                  <p className="empty-state-description">
                    OpenGenViz helps researchers analyze genomic sequences without command-line tools or complex software setup. 
                    Upload your FASTA files or fetch sequences directly from NCBI and EMBL-ENA databases. 
                    All analyses are automatically saved with full reproducibility.
                  </p>
                  <div className="empty-state-steps">
                    <div className="step-item">
                      <span className="step-number">1</span>
                      <span>Upload a local FASTA file or fetch from NCBI/EMBL</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">2</span>
                      <span>Wait for automatic sequence type detection</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">3</span>
                      <span>View analysis results and visualizations</span>
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

