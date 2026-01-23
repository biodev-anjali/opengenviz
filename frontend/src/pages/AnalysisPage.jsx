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
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <SkeletonLoader type="card" />
            <SkeletonLoader type="chart" />
          </div>
        )}

        {!currentAnalysis && !loading && (
          <>
            {/* Hero Section */}
            <div className="page-header" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '8px', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: '1.2' }}>
                Analyze Your DNA, RNA, and Protein Sequences
              </h1>
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.95, maxWidth: '700px', margin: '0 auto 2rem' }}>
                No coding or complex software needed. Upload your sequence data and get instant visualizations and analysis reports.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                  style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600, background: 'white', color: '#667eea', border: 'none' }}
                >
                  🧪 Try Demo Now
                </button>
                <a
                  href="/contact"
                  className="btn"
                  style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '2px solid white' }}
                >
                  Request a Demo
                </a>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="panel" style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1F2937' }}>The Problem</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4B5563' }}>
                Most biology research labs struggle with sequence analysis. Traditional tools require command-line skills, expensive software licenses, or IT support to set up. 
                Researchers waste time learning complex software instead of focusing on their science.
              </p>
            </div>

            {/* Solution Explanation */}
            <div className="panel" style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1F2937' }}>How OpenGenViz Helps</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4B5563', marginBottom: '1rem' }}>
                OpenGenViz runs entirely in your web browser. Upload your sequence file and get instant analysis with charts, statistics, and export-ready visualizations—all without installing anything or learning technical commands.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
                <li style={{ padding: '0.75rem 0', fontSize: '1rem', display: 'flex', alignItems: 'start' }}>
                  <span style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}>✓</span>
                  <span>Get composition analysis and identify patterns in your sequences</span>
                </li>
                <li style={{ padding: '0.75rem 0', fontSize: '1rem', display: 'flex', alignItems: 'start' }}>
                  <span style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}>✓</span>
                  <span>Compare sequences and detect mutations automatically</span>
                </li>
                <li style={{ padding: '0.75rem 0', fontSize: '1rem', display: 'flex', alignItems: 'start' }}>
                  <span style={{ marginRight: '0.75rem', fontSize: '1.5rem' }}>✓</span>
                  <span>Export publication-ready charts and PDF reports</span>
                </li>
              </ul>
            </div>

            {/* Target User Clarity */}
            <div className="panel" style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem', background: '#F8F9FA', border: '2px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1F2937' }}>Who This Is For</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4B5563' }}>
                <strong>Biology research labs and individual researchers</strong> who need to analyze DNA, RNA, or protein sequences but don't have dedicated IT support or time to learn complex bioinformatics tools. 
                Perfect for small labs, graduate students, and researchers who want to focus on science, not software.
              </p>
            </div>

            {/* Trust & Credibility */}
            <div className="panel" style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1F2937' }}>Built by Researchers, for Researchers</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4B5563' }}>
                OpenGenViz is developed by a team with backgrounds in biology, bioinformatics, and software engineering. We understand the challenges that small research labs face—limited IT support, tight budgets, and the need for tools that work without extensive training.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#6B7280', marginTop: '1rem', fontStyle: 'italic' }}>
                Our focus is on making sequence analysis accessible to biology researchers who want to focus on their science, not on learning complex software.
              </p>
            </div>
          </>
        )}

        {/* Landing Page Content - Only show when no analysis */}
        {!currentAnalysis && !loading && (
          <>
            {/* Upload Section */}
            <div style={{ maxWidth: '900px', margin: '0 auto 3rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: '#1F2937' }}>
                Ready to Analyze Your Data?
              </h2>
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
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="panel" style={{ maxWidth: '900px', margin: '0 auto 2rem', textAlign: 'center', background: '#F8F9FA', padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#1F2937' }}>
                Need Help Getting Started?
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4B5563', marginBottom: '1.5rem' }}>
                We're here to help your lab get the most out of OpenGenViz. Request a demo or contact us for collaboration.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="/contact"
                  className="btn btn-primary"
                  style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Request a Demo
                </a>
                <a
                  href="/contact"
                  className="btn"
                  style={{ padding: '0.875rem 2rem', fontSize: '1rem', textDecoration: 'none' }}
                >
                  Contact for Collaboration
                </a>
              </div>
            </div>
          </>
        )}

        {/* Analysis Results View - Show when analysis exists */}
        {currentAnalysis && (
          <>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
              <h2 className="page-title">Sequence Analysis</h2>
              <p className="page-subtitle">
                Your analysis results are shown below. Upload another file or try the demo to explore more.
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

                {currentAnalysis && (
                  <>
                    <AnalysisPanel analysis={currentAnalysis} />
                    <VisualizationPanel analysis={currentAnalysis} />
                    {currentAnalysis.sequence_type !== 'Protein' && (
                      <HeatmapPanel analysis={currentAnalysis} />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default AnalysisPage

