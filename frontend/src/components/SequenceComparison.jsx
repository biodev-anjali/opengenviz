/** Sequence comparison component */
import React, { useState, useEffect } from 'react'
import { api } from '../api/client'

const SequenceComparison = ({ history, onComparisonComplete, onError, setLoading }) => {
  const [referenceId, setReferenceId] = useState('')
  const [sampleId, setSampleId] = useState('')

  const handleCompare = async () => {
    const refId = parseInt(referenceId)
    const sampId = parseInt(sampleId)

    if (!refId || !sampId) {
      onError('Please select both reference and sample sequences')
      return
    }

    if (refId === sampId) {
      onError('Reference and sample must be different sequences')
      return
    }

    try {
      setLoading(true)
      const result = await api.compareSequences(refId, sampId)
      onComparisonComplete(result)
    } catch (error) {
      onError(error.userMessage || 'Error comparing sequences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Sequence Comparison</h2>
      
      <div className="form-group">
        <label>Reference Sequence (ID)</label>
        <select
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
        >
          <option value="">Select reference...</option>
          {history.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.sequence_type} ({item.sequence_length} bp)
              {item.source_identifier && ` - ${item.source_identifier}`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Sample Sequence (ID)</label>
        <select
          value={sampleId}
          onChange={(e) => setSampleId(e.target.value)}
        >
          <option value="">Select sample...</option>
          {history.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.sequence_type} ({item.sequence_length} bp)
              {item.source_identifier && ` - ${item.source_identifier}`}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleCompare}
        disabled={!referenceId || !sampleId}
        style={{ width: '100%' }}
      >
        Compare Sequences
      </button>

      <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        Select two sequences from history to compare and detect mutations.
      </p>
    </div>
  )
}

export default SequenceComparison

