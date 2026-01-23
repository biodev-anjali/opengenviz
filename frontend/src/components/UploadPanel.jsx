/** File upload panel component */
import React, { useState, useRef } from 'react'
import { api } from '../api/client'

const UploadPanel = ({ onAnalysisComplete, onError, setLoading }) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase()
      const isFasta = fileName.endsWith('.fasta') || fileName.endsWith('.fa') || fileName.endsWith('.fas')
      const isCsv = fileName.endsWith('.csv')
      const isTsv = fileName.endsWith('.tsv')
      
      if (isFasta || isCsv || isTsv) {
        setFile(selectedFile)
      } else {
        onError('Please select a valid file (.fasta, .fa, .fas, .csv, or .tsv). CSV/TSV files must have a "sequence" column.')
      }
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
      <h2 className="panel-title">Upload Your Sequence File</h2>
      <p className="helper-text" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
        💡 Upload a FASTA, CSV, or TSV file with your sequence data. The tool will automatically detect the type and analyze it for you.
      </p>
      
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
          accept=".fasta,.fa,.fas,.csv,.tsv"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <p>📁 Drag and drop a FASTA, CSV, or TSV file here, or click to select</p>
        {file && (
          <p className="file-selected">
            Selected: {file.name}
          </p>
        )}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload and Analyze
      </button>
      {!file && (
        <p className="helper-text">
          Select a FASTA, CSV, or TSV file to enable analysis. CSV/TSV files require a "sequence" column.
        </p>
      )}
    </div>
  )
}

export default UploadPanel

