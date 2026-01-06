"""Sequence comparison and mutation detection service."""
from typing import List, Dict, Any, Tuple
from Bio import pairwise2
from Bio.Seq import Seq
from utils.visualization_data import prepare_mutation_heatmap_data


def align_sequences(seq1: str, seq2: str) -> Dict[str, Any]:
    """
    Perform global alignment of two sequences using Needleman-Wunsch.
    
    Args:
        seq1: Reference sequence
        seq2: Sample sequence
        
    Returns:
        Dictionary with alignment results
    """
    # Convert to BioPython Seq objects
    ref_seq = Seq(seq1.upper())
    sample_seq = Seq(seq2.upper())
    
    # Perform global alignment
    # Match score: 2, Mismatch: -1, Gap open: -0.5, Gap extend: -0.1
    alignments = pairwise2.align.globalms(
        ref_seq, sample_seq,
        2, -1, -0.5, -0.1
    )
    
    if not alignments:
        return {
            "aligned_ref": "",
            "aligned_sample": "",
            "score": 0,
            "identity": 0.0
        }
    
    # Get best alignment
    best_alignment = alignments[0]
    aligned_ref = str(best_alignment.seqA)
    aligned_sample = str(best_alignment.seqB)
    score = best_alignment.score
    
    # Calculate identity percentage
    matches = sum(1 for a, b in zip(aligned_ref, aligned_sample) if a == b and a != '-')
    total = len(aligned_ref)
    identity = (matches / total * 100) if total > 0 else 0.0
    
    return {
        "aligned_ref": aligned_ref,
        "aligned_sample": aligned_sample,
        "score": score,
        "identity": round(identity, 2)
    }


def detect_mutations(ref_seq: str, sample_seq: str, alignment: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Detect mutations from aligned sequences.
    
    Args:
        ref_seq: Original reference sequence
        sample_seq: Original sample sequence
        alignment: Alignment result dictionary
        
    Returns:
        List of mutation dictionaries
    """
    mutations = []
    aligned_ref = alignment["aligned_ref"]
    aligned_sample = alignment["aligned_sample"]
    
    ref_pos = 0  # Position in original reference sequence
    sample_pos = 0  # Position in original sample sequence
    
    i = 0
    while i < len(aligned_ref):
        ref_char = aligned_ref[i]
        sample_char = aligned_sample[i]
        
        if ref_char == '-' and sample_char != '-':
            # Insertion in sample
            insertion_seq = sample_char
            j = i + 1
            while j < len(aligned_ref) and aligned_ref[j] == '-' and aligned_sample[j] != '-':
                insertion_seq += aligned_sample[j]
                j += 1
            
            mutations.append({
                "position": ref_pos,
                "type": "insertion",
                "ref": "-",
                "sample": insertion_seq,
                "aligned_position": i
            })
            sample_pos += len(insertion_seq)
            i = j
            continue
        
        elif ref_char != '-' and sample_char == '-':
            # Deletion in sample
            deletion_seq = ref_char
            j = i + 1
            while j < len(aligned_ref) and aligned_ref[j] != '-' and aligned_sample[j] == '-':
                deletion_seq += aligned_ref[j]
                j += 1
            
            mutations.append({
                "position": ref_pos,
                "type": "deletion",
                "ref": deletion_seq,
                "sample": "-",
                "aligned_position": i
            })
            ref_pos += len(deletion_seq)
            i = j
            continue
        
        elif ref_char != sample_char and ref_char != '-' and sample_char != '-':
            # Substitution
            mutations.append({
                "position": ref_pos,
                "type": "substitution",
                "ref": ref_char,
                "sample": sample_char,
                "aligned_position": i
            })
            ref_pos += 1
            sample_pos += 1
            i += 1
            continue
        
        # Match or gap handling
        if ref_char != '-':
            ref_pos += 1
        if sample_char != '-':
            sample_pos += 1
        i += 1
    
    return mutations


def compare_sequences(ref_seq: str, sample_seq: str) -> Dict[str, Any]:
    """
    Compare two sequences and detect mutations.
    
    Args:
        ref_seq: Reference sequence
        sample_seq: Sample sequence
        
    Returns:
        Dictionary with comparison results
    """
    # Perform alignment
    alignment = align_sequences(ref_seq, sample_seq)
    
    # Detect mutations
    mutations = detect_mutations(ref_seq, sample_seq, alignment)
    
    # Prepare mutation heatmap data
    mutation_heatmap = prepare_mutation_heatmap_data(
        mutations,
        len(ref_seq)
    )
    
    # Calculate statistics
    substitution_count = sum(1 for m in mutations if m["type"] == "substitution")
    insertion_count = sum(1 for m in mutations if m["type"] == "insertion")
    deletion_count = sum(1 for m in mutations if m["type"] == "deletion")
    
    return {
        "alignment": alignment,
        "mutations": mutations,
        "mutation_count": len(mutations),
        "substitution_count": substitution_count,
        "insertion_count": insertion_count,
        "deletion_count": deletion_count,
        "mutation_heatmap": mutation_heatmap
    }

