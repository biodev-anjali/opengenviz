/** Main application component with routing */
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AnalysisPage from './pages/AnalysisPage'
import ComparisonPage from './pages/ComparisonPage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import DocsPage from './components/DocsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AnalysisPage />} />
      <Route path="/compare" element={<ComparisonPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App

