/** Visualization panel with charts */
import React from 'react'
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
          <h3 className="chart-title">Nucleotide/Amino Acid Counts</h3>
          <p className="chart-caption">Distribution of nucleotides (DNA/RNA) or amino acids (Protein) in the sequence</p>
          <div className="chart-container">
            <Bar
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
          <h3 className="chart-title">
            {sequence_type === 'RNA' ? 'GC% vs AU%' : 'GC% vs AT%'}
          </h3>
          <p className="chart-caption">
            Composition ratio showing GC content versus AT (DNA) or AU (RNA) content
          </p>
          <div className="chart-container chart-container-pie">
            <Pie
              data={visualization_data.pie_chart}
              options={chartOptions}
            />
          </div>
        </div>
      )}

      {visualization_data.line_chart && sequence_type !== 'Protein' && (
        <div className="chart-section">
          <h3 className="chart-title">Sliding Window GC% Analysis</h3>
          <p className="chart-caption">GC content calculated across the sequence using a sliding window of 50 nucleotides</p>
          <div className="chart-container chart-container-large">
            <Line
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

