/** Shared layout component with header, navigation, and disclaimer */
import React from 'react'
import Navigation from './Navigation'
import Disclaimer from './Disclaimer'

const Layout = ({ children, showDisclaimer = true }) => {
  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>OpenGenViz - Genomic Analysis Platform</h1>
          <Navigation />
        </div>
      </header>
      
      {showDisclaimer && <Disclaimer />}
      
      {children}
    </div>
  )
}

export default Layout

