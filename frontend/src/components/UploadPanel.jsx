/** File upload panel component */
import React, { useState, useRef } from 'react'
import { api } from '../api/client'

const UploadPanel = ({ onAnalysisComplete, onError, setLoading }) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.name.endsWith('.fasta') || selectedFile.name.endsWith('.fa') || selectedFile.name.endsWith('.fas'))) {
      setFile(selectedFile)
    } else {
      onError('Please select a valid FASTA file (.fasta, .fa, or .fas)')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      onError('Please select a file to upload')
      return
    }

    try {
      setLoading(true)
      const result = await api.uploadSequence(file)
      onAnalysisComplete(result)
    } catch (error) {
      onError(error.userMessage || 'Error uploading file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Upload FASTA File</h2>
      
      <div
        className={`file-upload-area ${dragActive ? 'dragover' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".fasta,.fa,.fas"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <p>📁 Drag and drop a FASTA file here, or click to select</p>
        {file && (
          <p style={{ marginTop: '0.5rem', color: '#3498db', fontWeight: 600 }}>
            Selected: {file.name}
          </p>
        )}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!file}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        Upload and Analyze
      </button>
      {!file && (
        <p className="helper-text" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          Select a FASTA file to enable analysis
        </p>
      )}
    </div>
  )
}

export default UploadPanel

