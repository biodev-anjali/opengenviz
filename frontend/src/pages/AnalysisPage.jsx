/** Analysis page - main workflow for sequence analysis */
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import UploadPanel from '../components/UploadPanel'
import FetchPanel from '../components/FetchPanel'
import AnalysisPanel from '../components/AnalysisPanel'
import VisualizationPanel from '../components/VisualizationPanel'
import HeatmapPanel from '../components/HeatmapPanel'
import SkeletonLoader from '../components/SkeletonLoader'
import { api } from '../api/client'

const AnalysisPage = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedAnalysis = localStorage.getItem('opengenviz_current_analysis')
      if (savedAnalysis) {
        const analysis = JSON.parse(savedAnalysis)
        setCurrentAnalysis(analysis)
      }
    } catch (e) {
      console.log('Could not load saved analysis from localStorage:', e)
    }
  }, [])

  // Auto-load sample dataset for first-time users
  useEffect(() => {
    const hasVisited = localStorage.getItem('opengenviz_has_visited')
    
    // Only load sample if no saved state and first visit
    const savedAnalysis = localStorage.getItem('opengenviz_current_analysis')
    
    if (!hasVisited && !currentAnalysis && !savedAnalysis && !loading) {
      // Sample DNA sequence with good variation for visualizations
      const sampleFASTA = `>sample_dna_sequence
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATGCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG`
      
      const loadSample = async () => {
        try {
          setLoading(true)
          const result = await api.analyzeSequence(sampleFASTA)
          setCurrentAnalysis(result)
          localStorage.setItem('opengenviz_has_visited', 'true')
        } catch (error) {
          // Silently fail - user can still use the app normally
          console.log('Could not load sample dataset:', error.userMessage || error.message)
        } finally {
          setLoading(false)
        }
      }
      
      loadSample()
    }
  }, [])

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis)
    setError(null)
    // Save to localStorage for persistence
    try {
      localStorage.setItem('opengenviz_current_analysis', JSON.stringify(analysis))
    } catch (e) {
      console.log('Could not save analysis to localStorage:', e)
    }
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
            <strong>Who this is for:</strong> Bioinformatics and genomics researchers who need to analyze DNA, RNA, and protein sequences quickly without installing software or learning command-line tools.
          </p>
          <p className="page-subtitle" style={{ marginTop: '0.75rem' }}>
            <strong>What problem this solves:</strong> Raw sequence databases (NCBI, EMBL) only provide sequences. Analyzing them requires specialized software, command-line expertise, and manual data management. OpenGenViz delivers analysis-ready visualizations and insights directly in your browser.
          </p>
          <p className="page-subtitle" style={{ marginTop: '0.75rem' }}>
            <strong>Value over raw databases:</strong> Instead of downloading sequences and processing them locally, get instant composition analysis, GC-content trends, mutation detection, and publication-ready visualizations—all automatically saved with full reproducibility for research workflows.
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
                    Upload a FASTA file, CSV/TSV dataset, or fetch sequences from NCBI/EMBL databases. 
                    OpenGenViz automatically detects sequence types and performs comprehensive analysis with interactive visualizations.
                  </p>
                  <div className="empty-state-steps">
                    <div className="step-item">
                      <span className="step-number">1</span>
                      <span>Upload a FASTA, CSV, or TSV file, or fetch from databases</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">2</span>
                      <span>Automatic analysis with interactive visualizations</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">3</span>
                      <span>Export results, compare sequences, and access full history</span>
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

