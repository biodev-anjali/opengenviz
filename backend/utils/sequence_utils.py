"""Sequence parsing, validation, and type detection utilities."""
import re
import hashlib
from typing import Tuple, Optional


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

