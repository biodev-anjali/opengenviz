/** Navigation bar component */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '0.95rem',
    fontWeight: isActive(path) ? '600' : '400',
    background: isActive(path) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
    transition: 'all 0.2s',
  })

  return (
    <nav className="main-navigation">
      <Link to="/" style={navLinkStyle('/')}>
        Analysis
      </Link>
      <Link to="/compare" style={navLinkStyle('/compare')}>
        Compare
      </Link>
      <Link to="/history" style={navLinkStyle('/history')}>
        History
      </Link>
      <Link to="/docs" style={navLinkStyle('/docs')}>
        Docs
      </Link>
    </nav>
  )
}

export default Navigation

