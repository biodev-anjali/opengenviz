/** Analysis results display panel */
import React from 'react'

const AnalysisPanel = ({ analysis }) => {
  if (!analysis) return null

  const { sequence_type, length, counts, gc_percent, at_percent, source_type, source_identifier } = analysis

  return (
    <div className="panel">
      <h2 className="panel-title">Analysis Results</h2>
      
      <div className="analysis-metrics">
        <div className="metric-card">
          <div className="metric-label">Sequence Type</div>
          <div className="metric-value" style={{ fontSize: '1.2rem' }}>
            {sequence_type}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Length</div>
          <div className="metric-value">{length.toLocaleString()}</div>
        </div>
        {gc_percent !== null && gc_percent !== undefined && (
          <div className="metric-card">
            <div className="metric-label">GC%</div>
            <div className="metric-value">{gc_percent.toFixed(2)}%</div>
          </div>
        )}
        {at_percent !== null && at_percent !== undefined && (
          <div className="metric-card">
            <div className="metric-label">{sequence_type === 'RNA' ? 'AU%' : 'AT%'}</div>
            <div className="metric-value">{at_percent.toFixed(2)}%</div>
          </div>
        )}
      </div>

      {source_identifier && (
        <div className="source-info">
          <strong>Source:</strong> {source_type === 'upload' ? 'File Upload' : 'Database Fetch'} - {source_identifier}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Nucleotide/Amino Acid Counts</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Base/Amino Acid</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(counts).map(([base, count]) => {
              const percentage = length > 0 ? ((count / length) * 100).toFixed(2) : 0
              return (
                <tr key={base}>
                  <td><strong>{base}</strong></td>
                  <td>{count.toLocaleString()}</td>
                  <td>{percentage}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnalysisPanel

