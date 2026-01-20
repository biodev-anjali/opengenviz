/** Pricing page for early-access plans */
import React from 'react'
import Layout from '../components/Layout'

const PricingPage = () => {
  return (
    <Layout showDisclaimer={false}>
      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Simple, Research-Focused Pricing</h2>
          <p className="page-subtitle">
            Choose a plan that matches how you use OpenGenViz today. This is an early-access preview of our future pricing—no online payments yet.
          </p>
        </div>

        <div className="analysis-layout" style={{ alignItems: 'stretch' }}>
          <div
            className="analysis-right"
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '0.5rem',
            }}
          >
            {/* Free Plan */}
            <div
              className="panel"
              style={{ flex: '1 1 260px', minWidth: '260px' }}
            >
              <h3 className="panel-title">Free</h3>
              <p
                className="helper-text"
                style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}
              >
                For trying OpenGenViz with example data.
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹0</p>
              <ul className="docs-list" style={{ marginTop: '0.75rem' }}>
                <li>Sample dataset</li>
                <li>Limited CSV/TSV upload</li>
                <li>No exports</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div
              className="panel"
              style={{ flex: '1 1 260px', minWidth: '260px' }}
            >
              <h3 className="panel-title">Pro (Coming Soon)</h3>
              <p
                className="helper-text"
                style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}
              >
                For individual researchers and small teams.
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>₹1,999/month</p>
              <ul className="docs-list" style={{ marginTop: '0.75rem' }}>
                <li>Full upload</li>
                <li>PNG + PDF export</li>
                <li>Persistent sessions</li>
              </ul>
              <a
                href="mailto:hello@opengenviz.com?subject=OpenGenViz%20Pro%20Early%20Access"
                className="btn btn-primary"
                style={{ marginTop: '1rem', display: 'inline-block' }}
              >
                Request Early Access
              </a>
            </div>

            {/* Lab Plan */}
            <div
              className="panel"
              style={{ flex: '1 1 260px', minWidth: '260px' }}
            >
              <h3 className="panel-title">Lab</h3>
              <p
                className="helper-text"
                style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}
              >
                For labs, departments, and multi-user environments.
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>Custom</p>
              <p style={{ marginTop: '0.75rem' }}>
                Tailored deployments, higher limits, and collaboration options for research groups.
              </p>
              <a
                href="mailto:hello@opengenviz.com?subject=OpenGenViz%20Lab%20Plan"
                className="btn"
                style={{ marginTop: '1rem', display: 'inline-block' }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <p
          className="helper-text"
          style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}
        >
          We do not sell or share uploaded research data.
        </p>
      </div>
    </Layout>
  )
}

export default PricingPage