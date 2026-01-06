/** API client for backend communication */
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors with user-friendly messages
    if (error.response) {
      const message = error.response.data?.detail || error.response.data?.error || 'An error occurred'
      error.userMessage = message
    } else if (error.request) {
      error.userMessage = 'Network error: Could not reach the server'
    } else {
      error.userMessage = error.message || 'An unexpected error occurred'
    }
    return Promise.reject(error)
  }
)

// API methods
export const api = {
  // Upload FASTA file
  uploadSequence: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Fetch sequence from database
  fetchSequence: async (fetchRequest) => {
    const response = await apiClient.post('/api/v1/fetch-sequence', fetchRequest)
    return response.data
  },

  // Analyze sequence
  analyzeSequence: async (fastaContent) => {
    const response = await apiClient.post('/api/v1/analyze', {
      fasta_content: fastaContent,
    })
    return response.data
  },

  // Compare sequences
  compareSequences: async (referenceId, sampleId) => {
    const response = await apiClient.post('/api/v1/compare', {
      reference_id: referenceId,
      sample_id: sampleId,
    })
    return response.data
  },

  // Get history
  getHistory: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/v1/history', {
      params: { skip, limit },
    })
    return response.data
  },

  // Get history detail
  getHistoryDetail: async (analysisId) => {
    const response = await apiClient.get(`/api/v1/history/${analysisId}`)
    return response.data
  },
}

export default apiClient

