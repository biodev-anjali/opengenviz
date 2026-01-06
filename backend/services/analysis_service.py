"""Sequence analysis service."""
import json
from typing import Dict, List, Any
from utils.sequence_utils import detect_sequence_type, clean_sequence
from utils.visualization_data import (
    prepare_bar_chart_data,
    prepare_pie_chart_data,
    prepare_line_chart_data,
    prepare_heatmap_data
)


def analyze_dna_sequence(sequence: str) -> Dict[str, Any]:
    """
    Analyze DNA sequence and compute metrics.
    
    Args:
        sequence: Cleaned DNA sequence
        
    Returns:
        Dictionary with analysis results
    """
    sequence = sequence.upper()
    length = len(sequence)
    
    # Count nucleotides
    counts = {
        'A': sequence.count('A'),
        'T': sequence.count('T'),
        'G': sequence.count('G'),
        'C': sequence.count('C'),
        'N': sequence.count('N')
    }
    
    # Calculate percentages
    total = sum(counts.values())
    if total == 0:
        gc_percent = 0.0
        at_percent = 0.0
    else:
        gc_percent = ((counts['G'] + counts['C']) / total) * 100
        at_percent = ((counts['A'] + counts['T']) / total) * 100
    
    # Sliding window GC% (window size = 50)
    window_size = 50
    window_positions = []
    window_gc_percent = []
    gc_density = []
    
    for i in range(length):
        start = max(0, i - window_size // 2)
        end = min(length, i + window_size // 2)
        window_seq = sequence[start:end]
        
        if len(window_seq) > 0:
            window_total = len(window_seq)
            window_gc = window_seq.count('G') + window_seq.count('C')
            window_gc_pct = (window_gc / window_total) * 100 if window_total > 0 else 0
        else:
            window_gc_pct = 0
        
        gc_density.append(window_gc_pct)
        
        # Store window center positions for line chart
        if i % window_size == 0 or i == length - 1:
            window_positions.append(i)
            window_gc_percent.append(window_gc_pct)
    
    # Prepare visualization data
    bar_chart_data = prepare_bar_chart_data(counts)
    pie_chart_data = prepare_pie_chart_data(gc_percent, at_percent)
    line_chart_data = prepare_line_chart_data(window_positions, window_gc_percent)
    heatmap_data = prepare_heatmap_data(length, gc_density)
    
    return {
        "sequence_type": "DNA",
        "length": length,
        "counts": counts,
        "gc_percent": round(gc_percent, 2),
        "at_percent": round(at_percent, 2),
        "visualization_data": {
            "bar_chart": bar_chart_data,
            "pie_chart": pie_chart_data,
            "line_chart": line_chart_data,
            "heatmap": heatmap_data
        }
    }


def analyze_rna_sequence(sequence: str) -> Dict[str, Any]:
    """
    Analyze RNA sequence and compute metrics.
    
    Args:
        sequence: Cleaned RNA sequence
        
    Returns:
        Dictionary with analysis results
    """
    sequence = sequence.upper()
    length = len(sequence)
    
    # Count nucleotides (U instead of T)
    counts = {
        'A': sequence.count('A'),
        'U': sequence.count('U'),
        'G': sequence.count('G'),
        'C': sequence.count('C'),
        'N': sequence.count('N')
    }
    
    # Calculate percentages
    total = sum(counts.values())
    if total == 0:
        gc_percent = 0.0
        au_percent = 0.0
    else:
        gc_percent = ((counts['G'] + counts['C']) / total) * 100
        au_percent = ((counts['A'] + counts['U']) / total) * 100
    
    # Sliding window GC% (window size = 50)
    window_size = 50
    window_positions = []
    window_gc_percent = []
    gc_density = []
    
    for i in range(length):
        start = max(0, i - window_size // 2)
        end = min(length, i + window_size // 2)
        window_seq = sequence[start:end]
        
        if len(window_seq) > 0:
            window_total = len(window_seq)
            window_gc = window_seq.count('G') + window_seq.count('C')
            window_gc_pct = (window_gc / window_total) * 100 if window_total > 0 else 0
        else:
            window_gc_pct = 0
        
        gc_density.append(window_gc_pct)
        
        if i % window_size == 0 or i == length - 1:
            window_positions.append(i)
            window_gc_percent.append(window_gc_pct)
    
    # Prepare visualization data
    bar_chart_data = prepare_bar_chart_data(counts)
    pie_chart_data = prepare_pie_chart_data(gc_percent, au_percent)
    line_chart_data = prepare_line_chart_data(window_positions, window_gc_percent)
    heatmap_data = prepare_heatmap_data(length, gc_density)
    
    return {
        "sequence_type": "RNA",
        "length": length,
        "counts": counts,
        "gc_percent": round(gc_percent, 2),
        "at_percent": round(au_percent, 2),  # Actually AU% for RNA
        "visualization_data": {
            "bar_chart": bar_chart_data,
            "pie_chart": pie_chart_data,
            "line_chart": line_chart_data,
            "heatmap": heatmap_data
        }
    }


def analyze_protein_sequence(sequence: str) -> Dict[str, Any]:
    """
    Analyze protein sequence and compute amino acid composition.
    
    Args:
        sequence: Cleaned protein sequence
        
    Returns:
        Dictionary with analysis results
    """
    sequence = sequence.upper()
    length = len(sequence)
    
    # Count amino acids
    amino_acids = 'ACDEFGHIKLMNPQRSTVWY'
    counts = {aa: sequence.count(aa) for aa in amino_acids}
    
    # Add special characters
    counts['B'] = sequence.count('B')  # Asn or Asp
    counts['J'] = sequence.count('J')  # Leu or Ile
    counts['O'] = sequence.count('O')  # Pyrrolysine
    counts['U'] = sequence.count('U')  # Selenocysteine
    counts['X'] = sequence.count('X')  # Any
    counts['Z'] = sequence.count('Z')  # Glu or Gln
    
    # Filter out zeros
    counts = {k: v for k, v in counts.items() if v > 0}
    
    # Prepare visualization data (bar chart only for proteins)
    bar_chart_data = prepare_bar_chart_data(counts)
    
    return {
        "sequence_type": "Protein",
        "length": length,
        "counts": counts,
        "gc_percent": None,  # Not applicable
        "at_percent": None,  # Not applicable
        "visualization_data": {
            "bar_chart": bar_chart_data,
            "pie_chart": None,
            "line_chart": None,
            "heatmap": None
        }
    }


def analyze_sequence(sequence: str) -> Dict[str, Any]:
    """
    Analyze sequence based on detected type.
    
    Args:
        sequence: Raw sequence string
        
    Returns:
        Dictionary with analysis results
    """
    # Detect sequence type
    sequence_type = detect_sequence_type(sequence)
    
    # Clean sequence
    cleaned_sequence = clean_sequence(sequence, sequence_type)
    
    # Analyze based on type
    if sequence_type == "DNA":
        return analyze_dna_sequence(cleaned_sequence)
    elif sequence_type == "RNA":
        return analyze_rna_sequence(cleaned_sequence)
    elif sequence_type == "Protein":
        return analyze_protein_sequence(cleaned_sequence)
    else:
        raise ValueError(f"Unsupported sequence type: {sequence_type}")

