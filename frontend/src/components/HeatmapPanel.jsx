/** Heatmap visualization panel */
import React, { useRef, useEffect } from 'react'

const HeatmapPanel = ({ analysis, isMutationHeatmap = false }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!analysis || !analysis.visualization_data) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size based on container
    const container = canvas.parentElement
    if (container) {
      const containerWidth = container.clientWidth
      const maxWidth = 800
      canvas.width = Math.min(maxWidth, Math.max(300, containerWidth - 40))
      canvas.height = 300
    }

    const ctx = canvas.getContext('2d')
    const heatmapData = analysis.visualization_data.heatmap

    if (!heatmapData || !heatmapData.bins) return

    const bins = heatmapData.bins
    const binSize = heatmapData.bin_size || 100
    const sequenceLength = heatmapData.sequence_length

    // Set canvas size
    const padding = 40
    const barWidth = Math.max(2, Math.floor((canvas.width - padding * 2) / bins.length))
    const maxHeight = canvas.height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Find min and max values for color scaling
    let minVal, maxVal
    if (isMutationHeatmap) {
      minVal = 0
      maxVal = Math.max(...bins.map(b => b.mutation_count || b.density || 0), 1)
    } else {
      minVal = Math.min(...bins.map(b => b.gc_percent || 0))
      maxVal = Math.max(...bins.map(b => b.gc_percent || 0), 1)
    }

    // Draw heatmap bars
    bins.forEach((bin, index) => {
      const x = padding + index * barWidth
      let value, normalizedValue

      if (isMutationHeatmap) {
        value = bin.mutation_count || bin.density || 0
        normalizedValue = maxVal > 0 ? value / maxVal : 0
      } else {
        value = bin.gc_percent || 0
        normalizedValue = maxVal > minVal ? (value - minVal) / (maxVal - minVal) : 0
      }

      const barHeight = normalizedValue * maxHeight

      // Color gradient: blue (low) -> yellow (medium) -> red (high)
      let r, g, b
      if (normalizedValue < 0.5) {
        // Blue to Yellow
        const t = normalizedValue * 2
        r = Math.floor(t * 255)
        g = Math.floor(t * 255)
        b = Math.floor(255 * (1 - t))
      } else {
        // Yellow to Red
        const t = (normalizedValue - 0.5) * 2
        r = 255
        g = Math.floor(255 * (1 - t))
        b = 0
      }

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, canvas.height - padding - barHeight, barWidth - 1, barHeight)
    })

    // Draw axes
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(
      isMutationHeatmap ? 'Mutation Density' : 'GC%',
      canvas.width / 2,
      canvas.height - 10
    )

    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText(
      isMutationHeatmap ? 'Mutations per bin' : 'GC Percentage',
      0,
      0
    )
    ctx.restore()

    // Draw position labels (every 10th bin)
    ctx.textAlign = 'center'
    ctx.font = '10px Arial'
    bins.forEach((bin, index) => {
      if (index % Math.max(1, Math.floor(bins.length / 10)) === 0) {
        const x = padding + index * barWidth + barWidth / 2
        ctx.fillText(
          bin.position?.toString() || index * binSize,
          x,
          canvas.height - padding + 15
        )
      }
    })
  }, [analysis, isMutationHeatmap])

  if (!analysis || !analysis.visualization_data || !analysis.visualization_data.heatmap) {
    return null
  }

  return (
    <div className="panel">
      <h2 className="panel-title">
        {isMutationHeatmap ? 'Mutation Density Heatmap' : 'GC Density Heatmap'}
      </h2>
      <p className="chart-caption" style={{ marginBottom: '1rem' }}>
        {isMutationHeatmap
          ? 'Visual representation of mutation density across the sequence. Each bin shows the number of mutations detected in that region.'
          : 'Visual representation of GC content density across the sequence. Each bin represents the average GC percentage for that region.'}
      </p>
      <div className="heatmap-wrapper">
        <div className="heatmap-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="heatmap-canvas"
          />
        </div>
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">Low</span>
          <div className="heatmap-gradient"></div>
          <span className="heatmap-legend-label">High</span>
        </div>
      </div>
    </div>
  )
}

export default HeatmapPanel

