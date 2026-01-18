/** Navigation bar component with responsive hamburger menu */
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Analysis', icon: '📊' },
    { path: '/compare', label: 'Compare', icon: '🔬' },
    { path: '/history', label: 'History', icon: '📚' },
    { path: '/docs', label: 'Docs', icon: '📖' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/privacy', label: 'Privacy', icon: '🔒' },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.main-navigation')) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <nav className="main-navigation">
      {/* Desktop Navigation */}
      <div className="nav-desktop">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu-toggle"
        onClick={(e) => {
          e.stopPropagation()
          setIsMobileMenuOpen(!isMobileMenuOpen)
        }}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Mobile Navigation Drawer */}
      <div className={`nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-mobile ${active ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation

