/** Skeleton loader component for async content */
import React from 'react'

const SkeletonLoader = ({ type = 'text', lines = 3, className = '' }) => {
  if (type === 'card') {
    return (
      <div className={`panel ${className}`}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className={`panel ${className}`}>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-card"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="skeleton skeleton-text"
          style={{ width: idx === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export default SkeletonLoader

