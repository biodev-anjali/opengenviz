/** Main application component with routing */
import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AnalysisPage from './pages/AnalysisPage'
import SkeletonLoader from './components/SkeletonLoader'

// Lazy load pages that are not immediately needed
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const DocsPage = lazy(() => import('./components/DocsPage'))

const LoadingFallback = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <SkeletonLoader type="card" />
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<AnalysisPage />} />
      <Route
        path="/compare"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ComparisonPage />
          </Suspense>
        }
      />
      <Route
        path="/history"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HistoryPage />
          </Suspense>
        }
      />
      <Route
        path="/docs"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <DocsPage />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="/privacy"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPage />
          </Suspense>
        }
      />
      <Route
        path="/pricing"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PricingPage />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default App

