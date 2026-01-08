/** Shared layout component with header, navigation, and disclaimer */
import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from './Navigation'
import Disclaimer from './Disclaimer'

const Layout = ({ children, showDisclaimer = true }) => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1 className="app-title">OpenGenViz</h1>
          </Link>
          <Navigation />
        </div>
      </header>
      
      {showDisclaimer && <Disclaimer />}
      
      {children}
    </div>
  )
}

export default Layout

