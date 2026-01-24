/** Analysis page - main workflow for sequence analysis */
import React, { useState } from 'react'
import Layout from '../components/Layout'
import UploadPanel from '../components/UploadPanel'
import FetchPanel from '../components/FetchPanel'
import AnalysisPanel from '../components/AnalysisPanel'
import VisualizationPanel from '../components/VisualizationPanel'
import HeatmapPanel from '../components/HeatmapPanel'
import SkeletonLoader from '../components/SkeletonLoader'
import { api } from '../api/client'

const DEMO_CACHE_KEY = 'opengenviz_demo_cache'

const getCachedDemo = () => {
  try {
    const raw = sessionStorage.getItem(DEMO_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const setCachedDemo = (data) => {
  try {
    sessionStorage.setItem(DEMO_CACHE_KEY, JSON.stringify(data))
  } catch {}
}

const AnalysisPage = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalysisComplete = (analysis) => {
    setCurrentAnalysis(analysis)
    setError(null)
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
            <div
              className="page-header"
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '8px',
                marginBottom: '3rem'
              }}
            >
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

                      const cached = getCachedDemo()
                      if (cached) {
                        setCurrentAnalysis(cached)
                        return
                      }

                      const sampleFASTA = `>sample_dna_sequence
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATGCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG`

                      const result = await api.analyzeSequence(sampleFASTA)
                      setCurrentAnalysis(result)
                      setCachedDemo(result)
                    } catch (error) {
                      handleError(error.userMessage || 'Error loading demo data')
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

            <div style={{ maxWidth: '900px', margin: '0 auto 3rem' }}>
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
          </>
        )}

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
