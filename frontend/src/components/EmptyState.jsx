/** Reusable empty state component */
import React from 'react'

const EmptyState = ({ 
  icon = '📋', 
  title, 
  description, 
  actionLabel, 
  onAction,
  children 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-description">{description}</p>}
      {children}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction} style={{ marginTop: '1rem' }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState

