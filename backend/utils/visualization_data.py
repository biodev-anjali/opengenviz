"""Prepare visualization-ready datasets from analysis results."""
from typing import Dict, List, Any


def prepare_bar_chart_data(counts: Dict[str, int]) -> Dict[str, Any]:
    """
    Prepare bar chart data for nucleotide counts.
    
    Args:
        counts: Dictionary with nucleotide counts (A, T, G, C, N, etc.)
        
    Returns:
        Chart.js compatible dataset
    """
    labels = list(counts.keys())
    values = list(counts.values())
    
    return {
        "labels": labels,
        "datasets": [{
            "label": "Nucleotide Count",
            "data": values,
            "backgroundColor": [
                "rgba(54, 162, 235, 0.6)",  # A - blue
                "rgba(255, 99, 132, 0.6)",  # T - red
                "rgba(75, 192, 192, 0.6)",  # G - green
                "rgba(255, 206, 86, 0.6)",  # C - yellow
                "rgba(153, 102, 255, 0.6)", # N - purple
            ][:len(labels)],
            "borderColor": [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(153, 102, 255, 1)",
            ][:len(labels)],
            "borderWidth": 1
        }]
    }


def prepare_pie_chart_data(gc_percent: float, at_percent: float) -> Dict[str, Any]:
    """
    Prepare pie chart data for GC% vs AT%.
    
    Args:
        gc_percent: GC percentage
        at_percent: AT percentage
        
    Returns:
        Chart.js compatible dataset
    """
    return {
        "labels": ["GC%", "AT%"],
        "datasets": [{
            "label": "Composition",
            "data": [gc_percent, at_percent],
            "backgroundColor": [
                "rgba(75, 192, 192, 0.6)",  # GC - green
                "rgba(255, 99, 132, 0.6)",  # AT - red
            ],
            "borderColor": [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
            ],
            "borderWidth": 1
        }]
    }


def prepare_line_chart_data(window_positions: List[int], window_gc_percent: List[float]) -> Dict[str, Any]:
    """
    Prepare line chart data for sliding window GC%.
    
    Args:
        window_positions: List of window center positions
        window_gc_percent: List of GC% values for each window
        
    Returns:
        Chart.js compatible dataset
    """
    return {
        "labels": [str(pos) for pos in window_positions],
        "datasets": [{
            "label": "GC% (sliding window)",
            "data": window_gc_percent,
            "borderColor": "rgba(75, 192, 192, 1)",
            "backgroundColor": "rgba(75, 192, 192, 0.2)",
            "borderWidth": 2,
            "fill": True,
            "tension": 0.4
        }]
    }


def prepare_heatmap_data(sequence_length: int, gc_density: List[float], bin_size: int = 100) -> Dict[str, Any]:
    """
    Prepare heatmap data for GC density across sequence.
    
    Args:
        sequence_length: Total sequence length
        gc_density: List of GC% values (can be per-position or binned)
        bin_size: Size of bins for heatmap (default 100)
        
    Returns:
        Heatmap data structure
    """
    # Create bins
    num_bins = (sequence_length + bin_size - 1) // bin_size
    bins = []
    bin_labels = []
    
    for i in range(num_bins):
        start = i * bin_size
        end = min((i + 1) * bin_size, sequence_length)
        bin_labels.append(f"{start}-{end}")
        
        # Average GC% for this bin
        if len(gc_density) == sequence_length:
            # Per-position data, average over bin
            bin_data = gc_density[start:end]
            avg_gc = sum(bin_data) / len(bin_data) if bin_data else 0
        else:
            # Already binned data
            avg_gc = gc_density[i] if i < len(gc_density) else 0
        
        bins.append({
            "position": start,
            "end": end,
            "gc_percent": avg_gc,
            "bin_index": i
        })
    
    return {
        "labels": bin_labels,
        "bins": bins,
        "bin_size": bin_size,
        "sequence_length": sequence_length
    }


def prepare_mutation_heatmap_data(mutations: List[Dict[str, Any]], sequence_length: int, bin_size: int = 100) -> Dict[str, Any]:
    """
    Prepare heatmap data for mutation density.
    
    Args:
        mutations: List of mutation dictionaries with 'position' key
        sequence_length: Total sequence length
        bin_size: Size of bins for heatmap
        
    Returns:
        Heatmap data structure with mutation density
    """
    num_bins = (sequence_length + bin_size - 1) // bin_size
    bins = []
    bin_labels = []
    
    # Count mutations per bin
    mutation_counts = [0] * num_bins
    
    for mutation in mutations:
        pos = mutation.get('position', 0)
        bin_idx = min(pos // bin_size, num_bins - 1)
        mutation_counts[bin_idx] += 1
    
    for i in range(num_bins):
        start = i * bin_size
        end = min((i + 1) * bin_size, sequence_length)
        bin_labels.append(f"{start}-{end}")
        
        bins.append({
            "position": start,
            "end": end,
            "mutation_count": mutation_counts[i],
            "density": mutation_counts[i] / bin_size,  # Mutations per base
            "bin_index": i
        })
    
    return {
        "labels": bin_labels,
        "bins": bins,
        "bin_size": bin_size,
        "sequence_length": sequence_length,
        "total_mutations": len(mutations)
    }

