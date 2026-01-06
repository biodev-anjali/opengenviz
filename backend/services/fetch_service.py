"""Sequence fetching service for NCBI, EMBL/ENA, and direct URLs."""
import time
import requests
from typing import Optional, Tuple
from Bio import Entrez
from config import NCBI_EMAIL, NCBI_API_KEY


# Configure Entrez
Entrez.email = NCBI_EMAIL
if NCBI_API_KEY:
    Entrez.api_key = NCBI_API_KEY


def fetch_from_ncbi_accession(accession: str) -> Tuple[str, Optional[str]]:
    """
    Fetch sequence from NCBI using accession number.
    
    Args:
        accession: NCBI accession number (e.g., NM_000546)
        
    Returns:
        Tuple of (fasta_content, error_message)
    """
    try:
        # Search for the accession
        search_handle = Entrez.esearch(db="nucleotide", term=accession, retmax=1)
        search_results = Entrez.read(search_handle)
        search_handle.close()
        
        if not search_results["IdList"]:
            return None, f"Accession {accession} not found in NCBI"
        
        # Fetch the sequence
        fetch_handle = Entrez.efetch(
            db="nucleotide",
            id=search_results["IdList"][0],
            rettype="fasta",
            retmode="text"
        )
        fasta_content = fetch_handle.read()
        fetch_handle.close()
        
        # Rate limiting - be polite to NCBI
        time.sleep(0.34)  # NCBI recommends max 3 requests/second
        
        return fasta_content, None
        
    except Exception as e:
        return None, f"Error fetching from NCBI: {str(e)}"


def fetch_from_ncbi_gene(gene_name: str, species: str) -> Tuple[str, Optional[str]]:
    """
    Fetch sequence from NCBI using gene name and species.
    
    Args:
        gene_name: Gene name (e.g., TP53)
        species: Species name (e.g., Homo sapiens)
        
    Returns:
        Tuple of (fasta_content, error_message)
    """
    try:
        # Build search query
        query = f"{gene_name}[Gene Name] AND {species}[Organism]"
        
        # Search for the gene
        search_handle = Entrez.esearch(
            db="nucleotide",
            term=query,
            retmax=1,
            retmode="xml"
        )
        search_results = Entrez.read(search_handle)
        search_handle.close()
        
        if not search_results["IdList"]:
            return None, f"Gene {gene_name} not found for {species} in NCBI"
        
        # Fetch the first result
        fetch_handle = Entrez.efetch(
            db="nucleotide",
            id=search_results["IdList"][0],
            rettype="fasta",
            retmode="text"
        )
        fasta_content = fetch_handle.read()
        fetch_handle.close()
        
        # Rate limiting
        time.sleep(0.34)
        
        return fasta_content, None
        
    except Exception as e:
        return None, f"Error fetching gene from NCBI: {str(e)}"


def fetch_from_embl(accession: str) -> Tuple[str, Optional[str]]:
    """
    Fetch sequence from EMBL/ENA using accession number.
    
    Args:
        accession: EMBL/ENA accession number (e.g., X56957)
        
    Returns:
        Tuple of (fasta_content, error_message)
    """
    try:
        url = f"https://www.ebi.ac.uk/ena/browser/api/fasta/{accession}"
        
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        if not response.text or response.text.startswith("Error"):
            return None, f"Accession {accession} not found in EMBL/ENA"
        
        return response.text, None
        
    except requests.exceptions.RequestException as e:
        return None, f"Error fetching from EMBL/ENA: {str(e)}"
    except Exception as e:
        return None, f"Unexpected error: {str(e)}"


def fetch_from_url(url: str) -> Tuple[str, Optional[str]]:
    """
    Fetch sequence from direct URL.
    
    Args:
        url: Direct URL to FASTA file
        
    Returns:
        Tuple of (fasta_content, error_message)
    """
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        if not response.text:
            return None, "Empty response from URL"
        
        # Basic validation - check if it looks like FASTA
        if not response.text.strip().startswith('>'):
            return None, "URL does not appear to contain FASTA format"
        
        return response.text, None
        
    except requests.exceptions.RequestException as e:
        return None, f"Error fetching from URL: {str(e)}"
    except Exception as e:
        return None, f"Unexpected error: {str(e)}"


def fetch_sequence(
    source_type: str,
    accession: Optional[str] = None,
    gene_name: Optional[str] = None,
    species: Optional[str] = None,
    url: Optional[str] = None
) -> Tuple[str, Optional[str], Optional[str]]:
    """
    Fetch sequence from various sources.
    
    Args:
        source_type: 'ncbi_accession', 'ncbi_gene', 'embl', or 'url'
        accession: Accession number (for ncbi_accession or embl)
        gene_name: Gene name (for ncbi_gene)
        species: Species name (for ncbi_gene)
        url: Direct URL (for url)
        
    Returns:
        Tuple of (fasta_content, source_identifier, error_message)
    """
    if source_type == "ncbi_accession":
        if not accession:
            return None, None, "Accession number required"
        fasta, error = fetch_from_ncbi_accession(accession)
        return fasta, accession, error
    
    elif source_type == "ncbi_gene":
        if not gene_name or not species:
            return None, None, "Gene name and species required"
        identifier = f"{gene_name} ({species})"
        fasta, error = fetch_from_ncbi_gene(gene_name, species)
        return fasta, identifier, error
    
    elif source_type == "embl":
        if not accession:
            return None, None, "Accession number required"
        fasta, error = fetch_from_embl(accession)
        return fasta, accession, error
    
    elif source_type == "url":
        if not url:
            return None, None, "URL required"
        fasta, error = fetch_from_url(url)
        return fasta, url, error
    
    else:
        return None, None, f"Unknown source type: {source_type}"

