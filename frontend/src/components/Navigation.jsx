/** Navigation bar component */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', label: 'Analysis', icon: '📊' },
    { path: '/compare', label: 'Compare', icon: '🔬' },
    { path: '/history', label: 'History', icon: '📚' },
    { path: '/docs', label: 'Docs', icon: '📖' },
  ]

  return (
    <nav className="main-navigation">
      {navItems.map((item) => {
        const active = isActive(item.path)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default Navigation

