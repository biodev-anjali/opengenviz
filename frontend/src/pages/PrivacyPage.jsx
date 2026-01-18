/** Privacy and data handling page */
import React from 'react'
import Layout from '../components/Layout'

const PrivacyPage = () => {
  return (
    <Layout showDisclaimer={false}>
      <div className="docs-container">
        <div className="docs-content">
          <section className="docs-section">
            <h1 className="docs-title">Privacy & Data Handling</h1>
            
            <h2 className="docs-heading">Data Collection and Storage</h2>
            
            <h3 className="docs-subheading">Uploaded Data</h3>
            <p>
              When you upload sequences or datasets to OpenGenViz:
            </p>
            <ul className="docs-list">
              <li><strong>Sequences are stored:</strong> All uploaded sequences are stored on our servers to enable analysis history and reproducibility</li>
              <li><strong>Analysis results are saved:</strong> All analysis results, visualizations, and metadata are preserved in the database</li>
              <li><strong>Automatic deduplication:</strong> Sequences are hashed using SHA256 to detect duplicates and avoid redundant storage</li>
              <li><strong>Full history retention:</strong> All analyses are retained in your history for future access and replay</li>
            </ul>

            <h3 className="docs-subheading">Local Storage</h3>
            <p>
              OpenGenViz uses browser local storage to enhance your experience:
            </p>
            <ul className="docs-list">
              <li><strong>Current session state:</strong> The current dataset and visualization state are saved locally in your browser</li>
              <li><strong>Auto-restore on refresh:</strong> Your current analysis is automatically restored when you refresh the page</li>
              <li><strong>No personal data:</strong> Local storage only contains analysis data, not personal information</li>
              <li><strong>You control it:</strong> You can clear local storage at any time through your browser settings</li>
            </ul>

            <h2 className="docs-heading">How Your Data is Used</h2>
            
            <h3 className="docs-subheading">Analysis Processing</h3>
            <p>
              Your uploaded sequences are processed to:
            </p>
            <ul className="docs-list">
              <li>Perform sequence composition analysis</li>
              <li>Generate visualizations (charts, heatmaps)</li>
              <li>Enable sequence comparison and mutation detection</li>
              <li>Provide analysis history and reproducibility features</li>
            </ul>

            <h3 className="docs-subheading">Data Sharing</h3>
            <p>
              <strong>Your data is private:</strong> Uploaded sequences and analysis results are stored privately and are not shared with third parties. 
              Your analysis history is accessible only through your session.
            </p>

            <h3 className="docs-subheading">Public Database Queries</h3>
            <p>
              When you fetch sequences from public databases (NCBI, EMBL, ENA):
            </p>
            <ul className="docs-list">
              <li>Sequences are retrieved from public databases in real-time</li>
              <li>We do not store sequences from public databases beyond the analysis you perform</li>
              <li>Only the analyses you run are saved to your history</li>
              <li>No personal information is sent to public databases</li>
            </ul>

            <h2 className="docs-heading">Data Retention</h2>
            <p>
              Analysis results and sequences are retained in the database to maintain analysis history and enable reproducibility. 
              This allows you to access previous analyses and replay them exactly as performed.
            </p>

            <h2 className="docs-heading">Data Security</h2>
            <p>
              We implement standard security practices to protect your data:
            </p>
            <ul className="docs-list">
              <li><strong>Secure transmission:</strong> All data is transmitted over HTTPS</li>
              <li><strong>Database security:</strong> Analysis data is stored in secure databases with access controls</li>
              <li><strong>No external sharing:</strong> Your sequences and analyses are not shared with external services (except when you explicitly fetch from public databases)</li>
            </ul>

            <h2 className="docs-heading">Sensitive Data Considerations</h2>
            
            <div className="docs-warning" style={{ marginTop: '1rem' }}>
              <strong>⚠️ Important:</strong> If you are working with sensitive genomic data (e.g., patient data, proprietary research sequences, unpublished data):
            </div>
            
            <ul className="docs-list">
              <li><strong>Consider data sensitivity:</strong> Only upload data that you are authorized to share and process</li>
              <li><strong>Review institutional policies:</strong> Ensure your use of OpenGenViz complies with your institution's data handling policies</li>
              <li><strong>Understand storage:</strong> Uploaded sequences are stored on our servers and may be subject to data retention policies</li>
              <li><strong>For highly sensitive data:</strong> Consider using local analysis tools instead of cloud-based services</li>
            </ul>

            <h2 className="docs-heading">User Responsibilities</h2>
            <p>
              As a user of OpenGenViz, you are responsible for:
            </p>
            <ul className="docs-list">
              <li>Ensuring you have the right to upload and analyze the sequences you provide</li>
              <li>Complying with applicable data protection regulations (GDPR, HIPAA, etc.) where relevant</li>
              <li>Following your institution's policies regarding genomic data handling</li>
              <li>Not uploading data that you are not authorized to share or process</li>
            </ul>

            <h2 className="docs-heading">Cookies and Tracking</h2>
            <p>
              OpenGenViz uses minimal browser storage (localStorage) for session state management. We do not use tracking cookies or analytics services that identify individual users.
            </p>

            <h2 className="docs-heading">Data Export and Deletion</h2>
            <p>
              You can export your analysis results as PNG images or PDF reports at any time. 
              Analysis history is retained to support reproducibility, but you can clear your browser's local storage if you prefer not to restore previous sessions.
            </p>

            <h2 className="docs-heading">Updates to This Policy</h2>
            <p>
              We may update this privacy and data handling policy as our service evolves. 
              Significant changes will be communicated to users through the platform.
            </p>

            <h2 className="docs-heading">Contact</h2>
            <p>
              If you have questions about how OpenGenViz handles your data, please refer to the project repository or contact the development team.
            </p>

            <div className="docs-warning" style={{ marginTop: '2rem' }}>
              <strong>Disclaimer:</strong> OpenGenViz is designed for research and educational purposes. 
              While we implement security best practices, users should evaluate whether this service meets their specific data privacy and security requirements.
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default PrivacyPage

