# OpenGenViz

**OpenGenViz: An open, web-based genomic analysis and visualization platform for DNA/RNA sequence analysis, mutation detection, and reproducible bioinformatics research.**

## ⚠️ Disclaimer

**This tool is for educational and research purposes only. It is not intended for clinical or diagnostic use.**

## Overview

OpenGenViz is a production-ready bioinformatics web application that provides comprehensive sequence analysis capabilities. The platform supports multiple input methods, automatic sequence type detection, rich visualizations, mutation detection, and full work history with reproducibility.

## Features

### Core Functionality

- **Multiple Input Methods**
  - Upload local FASTA files
  - Fetch from NCBI using accession numbers or gene names
  - Fetch from EMBL/ENA databases
  - Direct FASTA URL fetching

- **Automatic Sequence Type Detection**
  - DNA sequences
  - RNA sequences
  - Protein sequences

- **Comprehensive Analysis**
  - Nucleotide/amino acid composition
  - GC% and AT% (or AU% for RNA) calculations
  - Sliding window GC% analysis
  - Sequence length and statistics

- **Rich Visualizations**
  - Bar charts for nucleotide/amino acid counts
  - Pie charts for GC% vs AT% composition
  - Line charts for sliding window GC% trends
  - GC-density heatmaps with color gradients
  - Mutation density heatmaps for sequence comparisons

- **Sequence Comparison & Mutation Detection**
  - Global alignment using Needleman-Wunsch algorithm
  - Detection of substitutions, insertions, and deletions
  - Mutation statistics and detailed mutation lists
  - Alignment visualization with color-coded mismatches

- **Full Work History & Reproducibility**
  - Automatic storage of all analyses
  - SHA256-based deduplication
  - Complete replay of previous analyses
  - Visualization regeneration from stored data
  - Public, read-only history system

## Architecture

The platform follows a clean separation of concerns:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │────────▶│    Backend   │────────▶│  Database   │
│  React+Vite │         │   FastAPI    │         │ SQLite/PG   │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   External  │
                       │    APIs     │
                       │ NCBI, EMBL  │
                       └─────────────┘
```

### Backend Architecture

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: Database ORM with SQLite (dev) and PostgreSQL (prod) support
- **Biopython**: Bioinformatics library for sequence analysis and alignment
- **Pydantic**: Data validation and settings management

### Frontend Architecture

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Chart.js**: Rich charting library
- **Axios**: HTTP client for API communication

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp ../.env.example .env
# Edit .env with your settings
```

5. Initialize the database:
```bash
python -m database.init_db
```

6. Start the backend server:
```bash
python main.py
# Or: uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults work for local dev):
```bash
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### Uploading a FASTA File

1. Click on the "Upload FASTA File" panel
2. Drag and drop a `.fasta`, `.fa`, or `.fas` file, or click to select
3. Click "Upload and Analyze"
4. View results in the analysis panels

### Fetching from Databases

1. Click on the "Fetch from Database" panel
2. Select a source type (NCBI Accession, Gene Name, EMBL/ENA, or Direct URL)
3. Enter the required information:
   - **NCBI Accession**: e.g., `NM_000546`
   - **Gene Name**: Gene name (e.g., `TP53`) and species (e.g., `Homo sapiens`)
   - **EMBL/ENA**: Accession number (e.g., `X56957`)
   - **Direct URL**: Full URL to a FASTA file
4. Click "Fetch and Analyze"

### Comparing Sequences

1. Upload or fetch at least two sequences
2. Go to the "Sequence Comparison" panel
3. Select a reference sequence and a sample sequence from the history
4. Click "Compare Sequences"
5. View mutation statistics, detailed mutation list, and mutation heatmap

### Viewing History

1. All analyses are automatically saved to history
2. Click on any item in the "History" panel to replay the analysis
3. View original FASTA, metrics, and regenerated visualizations
4. Use the "Refresh" button to reload the history list

## API Documentation

### Endpoints

#### `POST /api/v1/upload`
Upload and analyze a FASTA file.

**Request**: Multipart form data with `file` field

**Response**: `AnalysisResponse`

#### `POST /api/v1/fetch-sequence`
Fetch sequence from public database and analyze.

**Request Body**:
```json
{
  "source_type": "ncbi_accession",
  "accession": "NM_000546",
  "gene_name": null,
  "species": null,
  "url": null
}
```

**Response**: `AnalysisResponse`

#### `POST /api/v1/analyze`
Analyze sequence from FASTA content.

**Request Body**:
```json
{
  "fasta_content": ">sequence\nATGC..."
}
```

**Response**: `AnalysisResponse`

#### `POST /api/v1/compare`
Compare two sequences and detect mutations.

**Request Body**:
```json
{
  "reference_id": 1,
  "sample_id": 2
}
```

**Response**: `ComparisonResponse`

#### `GET /api/v1/history`
Get paginated list of analysis history.

**Query Parameters**:
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records (default: 100)

**Response**: `HistoryResponse`

#### `GET /api/v1/history/{analysis_id}`
Get full analysis record by ID.

**Response**: `HistoryDetailResponse`

### Interactive API Documentation

When the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Example FASTA Files

### DNA Sequence
```
>example_dna
ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG
```

### RNA Sequence
```
>example_rna
AUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGCAUGC
```

### Protein Sequence
```
>example_protein
MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQAGVWPAMTLAYLTIMQQHQRQMLPTLAGVHSELMNTLAQKQ
```

## Project Structure

```
opengenviz/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration management
│   ├── requirements.txt        # Python dependencies
│   ├── api/
│   │   └── v1/
│   │       ├── routes.py       # API route handlers
│   │       └── schemas.py      # Pydantic models
│   ├── services/
│   │   ├── fetch_service.py    # Sequence fetching
│   │   ├── analysis_service.py # Sequence analysis
│   │   ├── comparison_service.py # Alignment & mutations
│   │   └── history_service.py  # History management
│   ├── database/
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── database.py         # DB connection
│   │   └── init_db.py          # Schema initialization
│   └── utils/
│       ├── sequence_utils.py   # Sequence utilities
│       └── visualization_data.py # Chart data preparation
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   ├── api/
│   │   │   └── client.js       # API client
│   │   ├── components/         # React components
│   │   └── styles/
│   │       └── App.css         # Styles
└── README.md
```

## Development

### Running in Development Mode

**Backend**:
```bash
cd backend
uvicorn main:app --reload
```

**Frontend**:
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend**:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

**Backend**:
The backend can be deployed using any ASGI server (e.g., uvicorn, gunicorn with uvicorn workers).

### Database Migrations

For production, consider using Alembic for database migrations:
```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and create migrations
```

## Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- `DATABASE_URL`: Database connection string
- `API_HOST`: API server host (default: 0.0.0.0)
- `API_PORT`: API server port (default: 8000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)
- `NCBI_EMAIL`: Email for NCBI E-utilities (required)
- `NCBI_API_KEY`: API key for NCBI (optional but recommended)
- `DEBUG`: Enable debug mode (default: False)
- `MAX_FILE_SIZE`: Maximum upload file size in bytes (default: 10MB)

## Reproducibility

All analyses are stored with:
- Original FASTA content
- SHA256 sequence hash (for deduplication)
- Complete analysis results
- Visualization-ready datasets
- Timestamps

This allows full reproducibility - any analysis can be replayed exactly as it was performed, with all visualizations regenerated from stored data.

## Limitations

- Maximum file size: 10MB (configurable)
- NCBI rate limiting: 3 requests/second (enforced)
- Alignment algorithm: Global alignment only (Needleman-Wunsch)
- Sequence types: DNA, RNA, and Protein (standard amino acids)

## Future Enhancements

- BLAST integration
- NGS data support
- Additional annotation databases
- Multiple alignment support
- Phylogenetic tree construction
- Export functionality (PDF, CSV, etc.)

## Contributing

This is an educational/research project. Contributions are welcome! Please ensure:
- Code follows existing style
- Tests are included for new features
- Documentation is updated

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on the project repository.

---

**Remember**: This tool is for educational and research purposes only. It is not intended for clinical or diagnostic use.
