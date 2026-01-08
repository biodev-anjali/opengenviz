/** Documentation page component */
import React from 'react'
import { Link } from 'react-router-dom'

const DocsPage = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>OpenGenViz - Documentation</h1>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="docs-container">
        <div className="docs-content">
          {/* Overview Section */}
          <section className="docs-section">
            <h1 className="docs-title">OpenGenViz Documentation</h1>
            
            <div className="docs-warning">
              <strong>⚠️ Important Disclaimer:</strong> This tool is for educational and research purposes only.
              It is not intended for clinical or diagnostic use.
            </div>

            <h2 className="docs-heading">1. Overview</h2>
            <p>
              <strong>OpenGenViz</strong> is a web-based genomic analysis platform designed for students, 
              researchers, and educators. It provides tools for analyzing DNA, RNA, and protein sequences 
              with interactive visualizations and mutation detection capabilities.
            </p>
            <p>
              The platform automatically detects sequence types, computes composition metrics, generates 
              visualizations, and maintains a complete history of all analyses for reproducibility.
            </p>
          </section>

          {/* How to Use Section */}
          <section className="docs-section">
            <h2 className="docs-heading">2. How to Use the Platform</h2>
            
            <h3 className="docs-subheading">Upload FASTA File</h3>
            <p>
              You can upload a local FASTA file containing DNA, RNA, or protein sequences:
            </p>
            <ul className="docs-list">
              <li>Click on the <strong>"Upload FASTA File"</strong> panel</li>
              <li>Drag and drop a <code>.fasta</code>, <code>.fa</code>, or <code>.fas</code> file, or click to browse</li>
              <li>Click <strong>"Upload and Analyze"</strong></li>
              <li>The platform will automatically detect the sequence type and perform analysis</li>
            </ul>

            <h3 className="docs-subheading">Fetch from Public Databases</h3>
            <p>
              Instead of uploading, you can fetch sequences directly from public biological databases:
            </p>
            
            <h4 className="docs-subheading-2">NCBI Accession Number</h4>
            <ul className="docs-list">
              <li>Select the <strong>"NCBI Accession"</strong> tab</li>
              <li>Enter an accession number (e.g., <code>NM_000546</code> for TP53 gene)</li>
              <li>Click <strong>"Fetch and Analyze"</strong></li>
            </ul>

            <h4 className="docs-subheading-2">Gene Name + Species</h4>
            <ul className="docs-list">
              <li>Select the <strong>"Gene Name"</strong> tab</li>
              <li>Enter the gene name (e.g., <code>TP53</code>)</li>
              <li>Enter the species (e.g., <code>Homo sapiens</code>)</li>
              <li>Click <strong>"Fetch and Analyze"</strong></li>
            </ul>

            <h4 className="docs-subheading-2">EMBL/ENA Accession</h4>
            <ul className="docs-list">
              <li>Select the <strong>"EMBL/ENA"</strong> tab</li>
              <li>Enter an EMBL or ENA accession number (e.g., <code>X56957</code>)</li>
              <li>Click <strong>"Fetch and Analyze"</strong></li>
            </ul>

            <h4 className="docs-subheading-2">Direct FASTA URL</h4>
            <ul className="docs-list">
              <li>Select the <strong>"Direct URL"</strong> tab</li>
              <li>Enter a direct URL to a FASTA file</li>
              <li>Click <strong>"Fetch and Analyze"</strong></li>
            </ul>

            <h3 className="docs-subheading">Sequence Comparison</h3>
            <p>
              Compare two sequences to detect mutations:
            </p>
            <ul className="docs-list">
              <li>Upload or fetch at least two sequences (they will appear in History)</li>
              <li>Go to the <strong>"Sequence Comparison"</strong> panel</li>
              <li>Select a <strong>Reference</strong> sequence from the dropdown</li>
              <li>Select a <strong>Sample</strong> sequence from the dropdown</li>
              <li>Click <strong>"Compare Sequences"</strong></li>
              <li>View mutation statistics, detailed mutation list, and mutation heatmap</li>
            </ul>

            <h3 className="docs-subheading">History & Replay</h3>
            <p>
              All analyses are automatically saved:
            </p>
            <ul className="docs-list">
              <li>View all previous analyses in the <strong>"History"</strong> panel</li>
              <li>Click on any history item to replay the complete analysis</li>
              <li>View original FASTA, metrics, and regenerated visualizations</li>
              <li>Use the <strong>"Refresh"</strong> button to reload the history list</li>
            </ul>
          </section>

          {/* Analysis Explained Section */}
          <section className="docs-section">
            <h2 className="docs-heading">3. Analysis Explained</h2>
            
            <h3 className="docs-subheading">Sequence Type Detection</h3>
            <p>
              The platform automatically detects whether your sequence is:
            </p>
            <ul className="docs-list">
              <li><strong>DNA:</strong> Contains nucleotides A, T, G, C (and ambiguous codes like N)</li>
              <li><strong>RNA:</strong> Contains nucleotides A, U, G, C (U instead of T)</li>
              <li><strong>Protein:</strong> Contains standard amino acid letters</li>
            </ul>
            <p>
              Detection is case-insensitive and handles multi-line FASTA formats.
            </p>

            <h3 className="docs-subheading">Nucleotide / Amino Acid Composition</h3>
            <p>
              For each sequence, the platform counts:
            </p>
            <ul className="docs-list">
              <li><strong>DNA/RNA:</strong> Individual counts of A, T (or U), G, C, and ambiguous bases (N)</li>
              <li><strong>Protein:</strong> Counts of each amino acid (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y)</li>
            </ul>
            <p>
              These counts are displayed in a bar chart and table format.
            </p>

            <h3 className="docs-subheading">GC% and AT% (DNA/RNA only)</h3>
            <p>
              For DNA and RNA sequences, the platform calculates:
            </p>
            <ul className="docs-list">
              <li><strong>GC%:</strong> Percentage of guanine (G) and cytosine (C) bases</li>
              <li><strong>AT%:</strong> Percentage of adenine (A) and thymine (T) bases in DNA</li>
              <li><strong>AU%:</strong> Percentage of adenine (A) and uracil (U) bases in RNA</li>
            </ul>
            <p>
              Formula: <code>GC% = (G + C) / (A + T + G + C) × 100</code>
            </p>
            <p>
              These percentages are visualized in a pie chart showing the relative composition.
            </p>

            <h3 className="docs-subheading">Sliding Window GC Analysis</h3>
            <p>
              The platform performs a sliding window analysis to show how GC content varies across the sequence:
            </p>
            <ul className="docs-list">
              <li>A window of 50 bases slides along the sequence</li>
              <li>GC% is calculated for each window position</li>
              <li>Results are displayed as a line chart showing GC% trends</li>
              <li>This helps identify regions of high or low GC content</li>
            </ul>

            <h3 className="docs-subheading">Heatmaps</h3>
            
            <h4 className="docs-subheading-2">GC Density Heatmap</h4>
            <p>
              Shows GC content density across the entire sequence:
            </p>
            <ul className="docs-list">
              <li>The sequence is divided into bins (default: 100 bases per bin)</li>
              <li>Each bin is colored based on its average GC%</li>
              <li><strong>Color gradient:</strong> Blue (low GC%) → Yellow (medium) → Red (high GC%)</li>
              <li>Hover over bins to see exact positions and GC% values</li>
            </ul>

            <h4 className="docs-subheading-2">Mutation Density Heatmap</h4>
            <p>
              Generated during sequence comparison:
            </p>
            <ul className="docs-list">
              <li>Shows where mutations are concentrated along the sequence</li>
              <li>Each bin represents mutation density in that region</li>
              <li>Helps identify mutation hotspots</li>
              <li>Same color gradient as GC heatmap (blue = few mutations, red = many mutations)</li>
            </ul>
          </section>

          {/* Visualizations Section */}
          <section className="docs-section">
            <h2 className="docs-heading">4. Visualizations</h2>
            
            <h3 className="docs-subheading">Bar Chart</h3>
            <p>
              Displays nucleotide or amino acid composition:
            </p>
            <ul className="docs-list">
              <li>Each bar represents the count of a specific nucleotide/amino acid</li>
              <li>Color-coded for easy identification</li>
              <li>Helps quickly identify the most abundant bases/acids</li>
            </ul>

            <h3 className="docs-subheading">Pie Chart</h3>
            <p>
              Shows GC% vs AT% (or AU% for RNA) composition:
            </p>
            <ul className="docs-list">
              <li>Two segments representing GC and AT/AU percentages</li>
              <li>Provides a quick visual summary of sequence composition</li>
              <li>Only displayed for DNA and RNA sequences (not proteins)</li>
            </ul>

            <h3 className="docs-subheading">Line Chart</h3>
            <p>
              Displays sliding window GC% analysis:
            </p>
            <ul className="docs-list">
              <li>X-axis: Position along the sequence</li>
              <li>Y-axis: GC percentage (0-100%)</li>
              <li>Shows trends and variations in GC content</li>
              <li>Helps identify regions with unusual GC composition</li>
            </ul>

            <h3 className="docs-subheading">Heatmaps</h3>
            <p>
              Color-coded density visualizations:
            </p>
            <ul className="docs-list">
              <li><strong>Blue:</strong> Low values (low GC% or few mutations)</li>
              <li><strong>Yellow:</strong> Medium values</li>
              <li><strong>Red:</strong> High values (high GC% or many mutations)</li>
              <li>Interactive tooltips show exact values and positions</li>
              <li>Bins are labeled with position ranges for easy navigation</li>
            </ul>
          </section>

          {/* History & Reproducibility Section */}
          <section className="docs-section">
            <h2 className="docs-heading">5. History & Reproducibility</h2>
            
            <h3 className="docs-subheading">Automatic Saving</h3>
            <p>
              Every analysis is automatically saved to the history:
            </p>
            <ul className="docs-list">
              <li>Original FASTA content is stored</li>
              <li>All computed metrics are preserved</li>
              <li>Visualization data is saved for regeneration</li>
              <li>Timestamps record when each analysis was performed</li>
            </ul>

            <h3 className="docs-subheading">Duplicate Detection</h3>
            <p>
              The platform uses SHA256 hashing to detect duplicate sequences:
            </p>
            <ul className="docs-list">
              <li>Each sequence is hashed using SHA256 algorithm</li>
              <li>If you analyze the same sequence again, the existing record is reused</li>
              <li>This prevents duplicate storage and ensures consistency</li>
              <li>You can still view the original analysis even if it was analyzed before</li>
            </ul>

            <h3 className="docs-subheading">Re-opening Past Analyses</h3>
            <p>
              To view a previous analysis:
            </p>
            <ul className="docs-list">
              <li>Scroll through the History panel on the left</li>
              <li>Click on any history item</li>
              <li>The complete analysis will be replayed:
                <ul>
                  <li>Original FASTA content</li>
                  <li>All metrics (counts, GC%, AT%, etc.)</li>
                  <li>Regenerated charts and visualizations</li>
                  <li>Heatmaps recreated from stored data</li>
                </ul>
              </li>
            </ul>

            <h3 className="docs-subheading">Reproducible Visualizations</h3>
            <p>
              All visualizations are fully reproducible:
            </p>
            <ul className="docs-list">
              <li>Chart data is stored in JSON format</li>
              <li>Charts are regenerated from stored data, not recomputed</li>
              <li>This ensures visualizations remain identical to the original analysis</li>
              <li>Perfect for research reproducibility and documentation</li>
            </ul>
          </section>

          {/* Data Sources Section */}
          <section className="docs-section">
            <h2 className="docs-heading">6. Data Sources</h2>
            
            <h3 className="docs-subheading">NCBI (National Center for Biotechnology Information)</h3>
            <p>
              The platform uses NCBI E-utilities to fetch sequences:
            </p>
            <ul className="docs-list">
              <li><strong>Accession numbers:</strong> RefSeq (NM_*, XM_*, etc.) and GenBank accessions</li>
              <li><strong>Gene name queries:</strong> Search by gene symbol and species</li>
              <li>Rate limiting: Maximum 3 requests per second (enforced automatically)</li>
              <li>Requires a valid email address (configured in backend)</li>
            </ul>

            <h3 className="docs-subheading">EMBL/ENA (European Bioinformatics Institute)</h3>
            <p>
              Direct access to EMBL and ENA databases:
            </p>
            <ul className="docs-list">
              <li>Fetch sequences using EMBL/ENA accession numbers</li>
              <li>REST API integration</li>
              <li>Supports all EMBL and ENA sequence records</li>
            </ul>

            <h3 className="docs-subheading">Public Biological Databases</h3>
            <p>
              The platform can fetch from any publicly accessible FASTA URL:
            </p>
            <ul className="docs-list">
              <li>Direct URLs to FASTA files</li>
              <li>Any web-accessible sequence file</li>
              <li>Automatic format validation</li>
            </ul>
          </section>

          {/* Limitations Section */}
          <section className="docs-section">
            <h2 className="docs-heading">7. Limitations</h2>
            
            <div className="docs-warning" style={{ marginBottom: '1.5rem' }}>
              <strong>⚠️ Not for Medical Use:</strong> This platform is designed for educational and 
              research purposes only. It is <strong>NOT</strong> intended for clinical diagnosis, 
              medical decision-making, or patient care.
            </div>

            <h3 className="docs-subheading">Performance Considerations</h3>
            <ul className="docs-list">
              <li><strong>Large genomes:</strong> Very long sequences (millions of bases) may take longer to analyze</li>
              <li><strong>Sliding window:</strong> GC% sliding window analysis processes the entire sequence, which can be slow for very long sequences</li>
              <li><strong>Comparison:</strong> Sequence alignment for very long sequences may take time</li>
            </ul>

            <h3 className="docs-subheading">Sequence Type Support</h3>
            <ul className="docs-list">
              <li>Fully supports: DNA, RNA, and standard protein sequences</li>
              <li>Handles ambiguous nucleotides (N, R, Y, W, S, K, M, D, V, H, B)</li>
              <li>Protein sequences support standard 20 amino acids plus special characters (B, J, O, U, X, Z)</li>
            </ul>

            <h3 className="docs-subheading">Analysis Scope</h3>
            <ul className="docs-list">
              <li>Designed for single sequence analysis and pairwise comparison</li>
              <li>Does not support multiple sequence alignment (MSA)</li>
              <li>No phylogenetic tree construction</li>
              <li>No BLAST integration (future enhancement)</li>
              <li>No NGS data processing (future enhancement)</li>
            </ul>

            <h3 className="docs-subheading">File Size Limits</h3>
            <ul className="docs-list">
              <li>Maximum file size: 10MB (configurable)</li>
              <li>Very large files may timeout during upload</li>
              <li>Recommend splitting very long sequences into smaller chunks if needed</li>
            </ul>
          </section>

          {/* Getting Started Section */}
          <section className="docs-section">
            <h2 className="docs-heading">8. Getting Started</h2>
            
            <h3 className="docs-subheading">Quick Start Guide</h3>
            <ol className="docs-list" style={{ listStyleType: 'decimal', paddingLeft: '2rem' }}>
              <li>Upload a FASTA file or fetch a sequence from NCBI/EMBL</li>
              <li>Wait for automatic analysis to complete</li>
              <li>Explore the visualizations (bar chart, pie chart, line chart, heatmap)</li>
              <li>View detailed metrics in the Analysis Results panel</li>
              <li>Compare sequences using the Sequence Comparison tool</li>
              <li>Access previous analyses from the History panel</li>
            </ol>

            <h3 className="docs-subheading">Example FASTA Files</h3>
            <p>
              You can test the platform with these example sequences:
            </p>
            
            <h4 className="docs-subheading-2">DNA Sequence</h4>
            <pre className="docs-code">
{`>example_dna
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG`}
            </pre>

            <h4 className="docs-subheading-2">RNA Sequence</h4>
            <pre className="docs-code">
{`>example_rna
AUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGC`}
            </pre>

            <h4 className="docs-subheading-2">Protein Sequence</h4>
            <pre className="docs-code">
{`>example_protein
MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQAGVWPAMTLAYLTIMQQHQRQMLPTLAGVHSELMNTLAQKQ`}
            </pre>
          </section>

          {/* Footer */}
          <section className="docs-section" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #e0e0e0' }}>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
              OpenGenViz - Genomic Analysis Platform for Education and Research
            </p>
            <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              For questions or issues, please refer to the project repository or contact the development team.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DocsPage

