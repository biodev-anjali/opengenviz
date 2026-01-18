"""Sequence parsing, validation, and type detection utilities."""
import re
import hashlib
import csv
import io
from typing import Tuple, Optional, List, Dict


def parse_fasta(fasta_content: str) -> Tuple[Optional[str], str]:
    """
    Parse FASTA content and extract sequence.
    
    Args:
        fasta_content: Raw FASTA file content
        
    Returns:
        Tuple of (header, sequence) where header may be None
    """
    lines = fasta_content.strip().split('\n')
    
    if not lines:
        raise ValueError("Empty FASTA content")
    
    header = None
    sequence_parts = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        if line.startswith('>'):
            if header is None:
                header = line[1:].strip()
            else:
                # Multiple sequences - concatenate for now
                pass
        else:
            sequence_parts.append(line)
    
    sequence = ''.join(sequence_parts).upper()
    
    if not sequence:
        raise ValueError("No sequence found in FASTA content")
    
    return header, sequence


def detect_sequence_type(sequence: str) -> str:
    """
    Detect sequence type (DNA, RNA, or Protein).
    
    Args:
        sequence: Cleaned sequence string (uppercase)
        
    Returns:
        'DNA', 'RNA', or 'Protein'
    """
    # Remove whitespace and ambiguous characters for detection
    clean_seq = re.sub(r'[^A-Z]', '', sequence.upper())
    
    if not clean_seq:
        raise ValueError("Empty sequence after cleaning")
    
    # Check for RNA-specific character (U)
    has_u = 'U' in clean_seq
    has_t = 'T' in clean_seq
    
    # Check for DNA/RNA nucleotides only
    dna_rna_chars = set('ATGCUN')
    seq_chars = set(clean_seq)
    
    if seq_chars.issubset(dna_rna_chars):
        if has_u and not has_t:
            return 'RNA'
        elif has_t or (not has_u and not has_t):
            # Default to DNA if contains T or neither U nor T
            return 'DNA'
        else:
            return 'DNA'  # Default fallback
    
    # Check for protein (amino acids)
    # Standard amino acids: A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y
    # Special characters: B (Asn or Asp), J (Leu or Ile), O (Pyrrolysine), 
    # U (Selenocysteine), X (any), Z (Glu or Gln)
    protein_chars = set('ACDEFGHIKLMNPQRSTVWYBJOUXZ')
    
    if seq_chars.issubset(protein_chars):
        return 'Protein'
    
    # If we can't determine, default to DNA
    return 'DNA'


def clean_sequence(sequence: str, sequence_type: str) -> str:
    """
    Clean sequence by removing whitespace and invalid characters.
    
    Args:
        sequence: Raw sequence string
        sequence_type: 'DNA', 'RNA', or 'Protein'
        
    Returns:
        Cleaned sequence string
    """
    # Remove whitespace
    cleaned = re.sub(r'\s+', '', sequence.upper())
    
    if sequence_type == 'DNA':
        # Keep only A, T, G, C, N (and other IUPAC ambiguous codes)
        cleaned = re.sub(r'[^ATGCNRYWSKMDVHB]', '', cleaned)
    elif sequence_type == 'RNA':
        # Keep only A, U, G, C, N (and other IUPAC ambiguous codes)
        cleaned = re.sub(r'[^AUGCNRYWSKMDVHB]', '', cleaned)
    elif sequence_type == 'Protein':
        # Keep standard amino acids and special characters
        cleaned = re.sub(r'[^ACDEFGHIKLMNPQRSTVWYBJOUXZ]', '', cleaned)
    
    return cleaned


def compute_sequence_hash(sequence: str) -> str:
    """
    Compute SHA256 hash of sequence for deduplication.
    
    Args:
        sequence: Sequence string
        
    Returns:
        Hexadecimal hash string
    """
    return hashlib.sha256(sequence.encode('utf-8')).hexdigest()


def validate_fasta(fasta_content: str) -> Tuple[bool, Optional[str]]:
    """
    Validate FASTA content.
    
    Args:
        fasta_content: Raw FASTA content
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        header, sequence = parse_fasta(fasta_content)
        if not sequence:
            return False, "No sequence found in FASTA content"
        if len(sequence) < 1:
            return False, "Sequence is too short"
        return True, None
    except Exception as e:
        return False, str(e)


def parse_csv_tsv(content: str, filename: str) -> Tuple[str, Optional[str]]:
    """
    Parse CSV/TSV file and convert to FASTA format.
    
    Args:
        content: Raw CSV/TSV file content
        filename: Original filename (used to detect TSV by extension)
        
    Returns:
        Tuple of (fasta_content, error_message)
    """
    try:
        # Detect delimiter: TSV if filename ends with .tsv or content has tabs, else CSV
        is_tsv = filename.lower().endswith('.tsv') or '\t' in content.split('\n')[0]
        delimiter = '\t' if is_tsv else ','
        
        # Read CSV/TSV
        reader = csv.DictReader(io.StringIO(content), delimiter=delimiter)
        
        # Find sequence column (required) - try common names
        rows = list(reader)
        if not rows:
            return None, "CSV/TSV file is empty or has no data rows"
        
        fieldnames = reader.fieldnames
        if not fieldnames:
            return None, "CSV/TSV file has no headers"
        
        # Find sequence column
        sequence_col = None
        for col_name in ['sequence', 'seq', 'Sequence', 'SEQ', 'SEQUENCE']:
            if col_name in fieldnames:
                sequence_col = col_name
                break
        
        if not sequence_col:
            return None, f"Required 'sequence' column not found. Available columns: {', '.join(fieldnames)}"
        
        # Find ID column (optional) - try common names
        id_col = None
        for col_name in ['id', 'ID', 'Id', 'name', 'Name', 'NAME', 'sequence_id', 'sequence_ID', 'identifier', 'Identifier']:
            if col_name in fieldnames:
                id_col = col_name
                break
        
        # Convert to FASTA format (use first row or concatenate all)
        fasta_lines = []
        sequence_parts = []
        identifier = None
        
        for i, row in enumerate(rows):
            sequence_value = row.get(sequence_col, '').strip()
            if not sequence_value:
                continue  # Skip empty sequences
            
            if id_col and row.get(id_col):
                identifier = row[id_col].strip()
            else:
                identifier = f"sequence_{i+1}" if len(rows) > 1 else (fieldnames[0] if fieldnames else "sequence")
            
            # Use first sequence only for now (can be extended to handle multiple)
            if i == 0:
                sequence_parts.append(sequence_value)
                if identifier:
                    fasta_lines.append(f">{identifier}")
        
        if not sequence_parts:
            return None, f"No valid sequences found in '{sequence_col}' column"
        
        sequence = ''.join(sequence_parts).replace(' ', '').replace('\n', '').replace('\r', '')
        
        if not sequence:
            return None, "Sequence is empty after processing"
        
        # Build FASTA content
        fasta_content = f">{identifier or 'sequence'}\n{sequence}"
        
        return fasta_content, None
        
    except csv.Error as e:
        return None, f"CSV/TSV parsing error: {str(e)}"
    except Exception as e:
        return None, f"Error processing CSV/TSV file: {str(e)}"


def validate_csv_tsv(content: str, filename: str) -> Tuple[bool, Optional[str]]:
    """
    Validate CSV/TSV content and convert to FASTA.
    
    Args:
        content: Raw CSV/TSV content
        filename: Original filename
        
    Returns:
        Tuple of (is_valid, error_message or fasta_content)
    """
    fasta_content, error = parse_csv_tsv(content, filename)
    if error:
        return False, error
    
    # Validate the resulting FASTA
    is_valid, fasta_error = validate_fasta(fasta_content)
    if not is_valid:
        return False, f"CSV/TSV converted to FASTA but validation failed: {fasta_error}"
    
    return True, fasta_content

