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

  // Load saved state on mount and auto-load sample for first-time users
  useEffect(() => {
    const hasVisited = localStorage.getItem('opengenviz_has_visited')
    const savedAnalysis = localStorage.getItem('opengenviz_current_analysis')
    
    // Restore saved state if available
    if (savedAnalysis) {
      try {
        const analysis = JSON.parse(savedAnalysis)
        setCurrentAnalysis(analysis)
        return // Don't load sample if we have saved state
      } catch (e) {
        console.log('Could not load saved analysis from localStorage:', e)
      }
    }
    
    // Auto-load sample dataset for first-time users (only if no saved state)
    if (!hasVisited && !savedAnalysis) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount only

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
          <h2 className="page-title">Analyze Your DNA, RNA, and Protein Sequences</h2>
          <p className="page-subtitle" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            <strong>For biology research labs:</strong> No coding or complex software needed. Upload your sequence data and get instant visualizations and analysis reports.
          </p>
          <p className="page-subtitle" style={{ marginTop: '0.75rem', fontSize: '1rem' }}>
            <strong>The problem we solve:</strong> Most sequence analysis tools require command-line skills or expensive software licenses. OpenGenViz runs in your web browser—upload your data and see results in seconds.
          </p>
          <p className="page-subtitle" style={{ marginTop: '0.75rem', fontSize: '1rem' }}>
            <strong>How it helps:</strong> Get composition analysis, identify patterns, compare sequences, and export publication-ready charts—all without installing anything or learning technical commands.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="/contact"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Request a Demo
            </a>
            <a
              href="/contact"
              className="btn"
              style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', textDecoration: 'none' }}
            >
              Contact for Collaboration
            </a>
          </div>
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
                  <h3 className="empty-state-title">See How It Works—Try the Demo</h3>
                  <p className="empty-state-description">
                    Click below to load a sample DNA sequence and see instant analysis results. No upload needed—just explore how OpenGenViz works.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        setLoading(true)
                        const sampleFASTA = `>sample_dna_sequence
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATGCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG`
                        const result = await api.analyzeSequence(sampleFASTA)
                        setCurrentAnalysis(result)
                        localStorage.setItem('opengenviz_has_visited', 'true')
                        try {
                          localStorage.setItem('opengenviz_current_analysis', JSON.stringify(result))
                        } catch (e) {
                          console.log('Could not save analysis to localStorage:', e)
                        }
                      } catch (error) {
                        onError(error.userMessage || 'Error loading demo data')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    style={{ marginTop: '1.5rem', fontSize: '1.1rem', padding: '0.875rem 2rem', fontWeight: 600 }}
                  >
                    🧪 Try Demo Now
                  </button>
                  <p className="helper-text" style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    Or upload your own sequence file below to analyze your research data.
                  </p>
                  <div className="empty-state-steps" style={{ marginTop: '2rem' }}>
                    <div className="step-item">
                      <span className="step-number">1</span>
                      <span>Upload your sequence file (FASTA, CSV, or TSV format)</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">2</span>
                      <span>View automatic analysis with charts and statistics</span>
                    </div>
                    <div className="step-item">
                      <span className="step-number">3</span>
                      <span>Export results for your research papers or presentations</span>
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

