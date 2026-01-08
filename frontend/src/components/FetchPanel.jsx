/** Sequence fetch panel component */
import React, { useState } from 'react'
import { api } from '../api/client'

const FetchPanel = ({ onAnalysisComplete, onError, setLoading }) => {
  const [activeTab, setActiveTab] = useState('ncbi_accession')
  const [ncbiAccession, setNcbiAccession] = useState('')
  const [geneName, setGeneName] = useState('')
  const [species, setSpecies] = useState('Homo sapiens')
  const [emblAccession, setEmblAccession] = useState('')
  const [url, setUrl] = useState('')

  const handleFetch = async () => {
    let fetchRequest = { source_type: activeTab }

    try {
      setLoading(true)

      if (activeTab === 'ncbi_accession') {
        if (!ncbiAccession.trim()) {
          onError('Please enter an NCBI accession number')
          return
        }
        fetchRequest.accession = ncbiAccession.trim()
      } else if (activeTab === 'ncbi_gene') {
        if (!geneName.trim() || !species.trim()) {
          onError('Please enter both gene name and species')
          return
        }
        fetchRequest.gene_name = geneName.trim()
        fetchRequest.species = species.trim()
      } else if (activeTab === 'embl') {
        if (!emblAccession.trim()) {
          onError('Please enter an EMBL/ENA accession number')
          return
        }
        fetchRequest.accession = emblAccession.trim()
      } else if (activeTab === 'url') {
        if (!url.trim()) {
          onError('Please enter a URL')
          return
        }
        fetchRequest.url = url.trim()
      }

      const result = await api.fetchSequence(fetchRequest)
      onAnalysisComplete(result)
    } catch (error) {
      onError(error.userMessage || 'Error fetching sequence')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Fetch from Database</h2>
      
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'ncbi_accession' ? 'active' : ''}`}
          onClick={() => setActiveTab('ncbi_accession')}
        >
          NCBI Accession
        </button>
        <button
          className={`tab ${activeTab === 'ncbi_gene' ? 'active' : ''}`}
          onClick={() => setActiveTab('ncbi_gene')}
        >
          Gene Name
        </button>
        <button
          className={`tab ${activeTab === 'embl' ? 'active' : ''}`}
          onClick={() => setActiveTab('embl')}
        >
          EMBL/ENA
        </button>
        <button
          className={`tab ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          Direct URL
        </button>
      </div>

      <div className="form-group">
        {activeTab === 'ncbi_accession' && (
          <>
            <label>NCBI Accession Number</label>
            <input
              type="text"
              placeholder="e.g., NM_000546"
              value={ncbiAccession}
              onChange={(e) => setNcbiAccession(e.target.value)}
            />
          </>
        )}

        {activeTab === 'ncbi_gene' && (
          <>
            <label>Gene Name</label>
            <input
              type="text"
              placeholder="e.g., TP53"
              value={geneName}
              onChange={(e) => setGeneName(e.target.value)}
            />
            <label style={{ marginTop: '0.5rem' }}>Species</label>
            <input
              type="text"
              placeholder="e.g., Homo sapiens"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            />
          </>
        )}

        {activeTab === 'embl' && (
          <>
            <label>EMBL/ENA Accession Number</label>
            <input
              type="text"
              placeholder="e.g., X56957"
              value={emblAccession}
              onChange={(e) => setEmblAccession(e.target.value)}
            />
          </>
        )}

        {activeTab === 'url' && (
          <>
            <label>FASTA File URL</label>
            <input
              type="text"
              placeholder="https://example.com/sequence.fasta"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </>
        )}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleFetch}
        disabled={
          (activeTab === 'ncbi_accession' && !ncbiAccession.trim()) ||
          (activeTab === 'ncbi_gene' && (!geneName.trim() || !species.trim())) ||
          (activeTab === 'embl' && !emblAccession.trim()) ||
          (activeTab === 'url' && !url.trim())
        }
        style={{ width: '100%' }}
      >
        Fetch and Analyze
      </button>
      {((activeTab === 'ncbi_accession' && !ncbiAccession.trim()) ||
        (activeTab === 'ncbi_gene' && (!geneName.trim() || !species.trim())) ||
        (activeTab === 'embl' && !emblAccession.trim()) ||
        (activeTab === 'url' && !url.trim())) && (
        <p className="helper-text" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          Fill in the required fields to enable fetching
        </p>
      )}
    </div>
  )
}

export default FetchPanel

