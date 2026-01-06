/** History detail component for replaying analysis */
import React from 'react'
import AnalysisPanel from './AnalysisPanel'
import VisualizationPanel from './VisualizationPanel'
import HeatmapPanel from './HeatmapPanel'

const HistoryDetail = ({ analysis, onReanalyze }) => {
  if (!analysis) return null

  // Transform history detail to match analysis format
  const analysisData = {
    analysis_id: analysis.id,
    sequence_type: analysis.sequence_type,
    length: analysis.sequence_length,
    counts: analysis.metadata.counts || {},
    gc_percent: analysis.metadata.gc_percent,
    at_percent: analysis.metadata.at_percent,
    visualization_data: analysis.visualization_data || {},
    source_type: analysis.source_type,
    source_identifier: analysis.source_identifier,
  }

  return (
    <>
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="panel-title" style={{ margin: 0 }}>
            Analysis History - ID: {analysis.id}
          </h2>
          <button
            className="btn btn-secondary"
            onClick={onReanalyze}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Close
          </button>
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '4px' }}>
          <div><strong>Created:</strong> {new Date(analysis.created_at).toLocaleString()}</div>
          {analysis.source_identifier && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Source:</strong> {analysis.source_identifier}
            </div>
          )}
        </div>
      </div>

      <AnalysisPanel analysis={analysisData} />
      <VisualizationPanel analysis={analysisData} />
      {analysis.sequence_type !== 'Protein' && (
        <HeatmapPanel analysis={analysisData} />
      )}

      <div className="panel">
        <h3 className="panel-title">Original FASTA</h3>
        <pre
          style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {analysis.original_fasta}
        </pre>
      </div>
    </>
  )
}

export default HistoryDetail

