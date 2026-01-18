/** Visualization panel with charts */
import React, { useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const VisualizationPanel = ({ analysis }) => {
  if (!analysis || !analysis.visualization_data) return null

  const { visualization_data, sequence_type } = analysis
  const barChartRef = useRef(null)
  const pieChartRef = useRef(null)
  const lineChartRef = useRef(null)

  const exportChartAsPNG = (chartRef, filename) => {
    if (!chartRef || !chartRef.current) return
    
    const chartInstance = chartRef.current
    const canvas = chartInstance.canvas
    if (!canvas) return
    
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Visualizations</h2>

      {visualization_data.bar_chart && (
        <div className="chart-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="chart-title">Nucleotide/Amino Acid Counts</h3>
            <button
              className="btn"
              onClick={() => exportChartAsPNG(barChartRef, 'bar_chart.png')}
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
            >
              📥 Export PNG
            </button>
          </div>
          <p className="chart-caption">Distribution of nucleotides (DNA/RNA) or amino acids (Protein) in the sequence</p>
          <div className="chart-container">
            <Bar
              ref={barChartRef}
              data={visualization_data.bar_chart}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Count',
                      font: {
                        size: 12,
                        weight: 'bold',
                      },
                    },
                    ticks: {
                      precision: 0,
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: sequence_type === 'Protein' ? 'Amino Acid' : 'Nucleotide',
                      font: {
                        size: 12,
                        weight: 'bold',
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {visualization_data.pie_chart && sequence_type !== 'Protein' && (
        <div className="chart-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="chart-title">
              {sequence_type === 'RNA' ? 'GC% vs AU%' : 'GC% vs AT%'}
            </h3>
            <button
              className="btn"
              onClick={() => exportChartAsPNG(pieChartRef, 'pie_chart.png')}
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
            >
              📥 Export PNG
            </button>
          </div>
          <p className="chart-caption">
            Composition ratio showing GC content versus AT (DNA) or AU (RNA) content
          </p>
          <div className="chart-container chart-container-pie">
            <Pie
              ref={pieChartRef}
              data={visualization_data.pie_chart}
              options={chartOptions}
            />
          </div>
        </div>
      )}

      {visualization_data.line_chart && sequence_type !== 'Protein' && (
        <div className="chart-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="chart-title">Sliding Window GC% Analysis</h3>
            <button
              className="btn"
              onClick={() => exportChartAsPNG(lineChartRef, 'line_chart.png')}
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
            >
              📥 Export PNG
            </button>
          </div>
          <p className="chart-caption">GC content calculated across the sequence using a sliding window of 50 nucleotides</p>
          <div className="chart-container chart-container-large">
            <Line
              ref={lineChartRef}
              data={visualization_data.line_chart}
              options={{
                ...chartOptions,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Position in Sequence',
                      font: {
                        size: 12,
                        weight: 'bold',
                      },
                    },
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'GC Percentage (%)',
                      font: {
                        size: 12,
                        weight: 'bold',
                      },
                    },
                    min: 0,
                    max: 100,
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default VisualizationPanel

