/** About page describing scientific use cases */
import React from 'react'
import Layout from '../components/Layout'

const AboutPage = () => {
  return (
    <Layout showDisclaimer={false}>
      <div className="docs-container">
        <div className="docs-content">
          <section className="docs-section">
            <h1 className="docs-title">About OpenGenViz</h1>
            
            <h2 className="docs-heading">Who We Serve</h2>
            <p>
              OpenGenViz is designed for <strong>bioinformatics researchers</strong> and <strong>genomics scientists</strong> who need 
              to analyze DNA, RNA, and protein sequences quickly and efficiently. Whether you're studying gene expression, 
              investigating mutations, exploring evolutionary relationships, or validating experimental results, OpenGenViz 
              provides the analysis tools you need without requiring command-line expertise or local software installation.
            </p>

            <h2 className="docs-heading">Scientific Use Cases</h2>
            
            <h3 className="docs-subheading">1. Sequence Composition Analysis</h3>
            <p>
              Analyze nucleotide or amino acid composition patterns to understand sequence characteristics:
            </p>
            <ul className="docs-list">
              <li>Calculate GC content to identify high-GC regions (often associated with gene-rich areas)</li>
              <li>Examine AT/GC ratios for codon bias analysis in coding sequences</li>
              <li>Compare composition patterns across different sequences or species</li>
              <li>Identify composition anomalies that may indicate sequencing errors or unusual features</li>
            </ul>

            <h3 className="docs-subheading">2. Mutation Detection and Comparison</h3>
            <p>
              Compare sequences to detect and characterize mutations:
            </p>
            <ul className="docs-list">
              <li>Identify single nucleotide polymorphisms (SNPs) between reference and sample sequences</li>
              <li>Detect insertions and deletions (indels) in comparative genomics studies</li>
              <li>Visualize mutation hotspots along sequences using heatmaps</li>
              <li>Generate mutation statistics for quality control and variant calling validation</li>
            </ul>

            <h3 className="docs-subheading">3. Database Sequence Validation</h3>
            <p>
              Fetch and validate sequences from public databases:
            </p>
            <ul className="docs-list">
              <li>Retrieve sequences from NCBI, EMBL, and ENA databases by accession number or gene name</li>
              <li>Verify sequence integrity and composition before experimental use</li>
              <li>Compare downloaded sequences against expected annotations</li>
              <li>Prepare reference sequences for alignment or annotation workflows</li>
            </ul>

            <h3 className="docs-subheading">4. Research Workflow Integration</h3>
            <p>
              Support reproducible research workflows:
            </p>
            <ul className="docs-list">
              <li>Save and replay analyses with full reproducibility</li>
              <li>Export visualizations and reports for publications</li>
              <li>Maintain analysis history for research documentation</li>
              <li>Share analysis results with exact reproducibility for collaboration</li>
            </ul>

            <h3 className="docs-subheading">5. Educational and Training Applications</h3>
            <p>
              Teach genomics and bioinformatics concepts:
            </p>
            <ul className="docs-list">
              <li>Demonstrate sequence composition principles in educational settings</li>
              <li>Visualize concepts like GC content, mutation types, and sequence variation</li>
              <li>Provide hands-on experience without requiring complex software setup</li>
              <li>Enable students to explore real genomic data interactively</li>
            </ul>

            <h2 className="docs-heading">What Makes OpenGenViz Different</h2>
            
            <h3 className="docs-subheading">Instant Analysis</h3>
            <p>
              Unlike raw databases that only provide sequences, OpenGenViz delivers analysis-ready results. 
              Upload or fetch a sequence and immediately see composition analysis, visualizations, and insights 
              without downloading files or running command-line tools.
            </p>

            <h3 className="docs-subheading">Zero Installation</h3>
            <p>
              No need to install specialized bioinformatics software or configure local environments. 
              OpenGenViz runs entirely in your web browser, making sequence analysis accessible from any computer.
            </p>

            <h3 className="docs-subheading">Full Reproducibility</h3>
            <p>
              Every analysis is automatically saved with complete metadata. Replay any previous analysis 
              exactly as it was performed, with all visualizations regenerated from stored data. Perfect 
              for research documentation and collaboration.
            </p>

            <h3 className="docs-subheading">Integrated Workflows</h3>
            <p>
              From sequence upload to visualization to comparison, OpenGenViz provides an integrated workflow 
              that eliminates the need to switch between multiple tools or manage files manually.
            </p>

            <h2 className="docs-heading">Technical Capabilities</h2>
            <ul className="docs-list">
              <li><strong>Sequence Types:</strong> DNA, RNA, and protein sequences</li>
              <li><strong>Input Formats:</strong> FASTA files, CSV/TSV datasets, database accessions</li>
              <li><strong>Analysis:</strong> Composition analysis, GC-content calculations, sliding window analysis</li>
              <li><strong>Visualization:</strong> Bar charts, pie charts, line charts, and heatmaps</li>
              <li><strong>Comparison:</strong> Global alignment, mutation detection, variant analysis</li>
              <li><strong>Export:</strong> PNG images and PDF reports</li>
            </ul>

            <h2 className="docs-heading">Research-Grade Quality</h2>
            <p>
              OpenGenViz is built with research reproducibility in mind. All analyses use standard algorithms 
              and preserve original data. Results can be exported for publication and shared with collaborators 
              with complete transparency and reproducibility.
            </p>

            <div className="docs-warning" style={{ marginTop: '2rem' }}>
              <strong>Note:</strong> OpenGenViz is designed for research and educational purposes. 
              It is not intended for clinical diagnosis or medical decision-making.
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage

