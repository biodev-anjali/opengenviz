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
      },
      title: {
        display: true,
        text: '',
      },
    },
  }

  return (
    <div className="panel">
      <h2 className="panel-title">Visualizations</h2>

      {visualization_data.bar_chart && (
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Nucleotide/Amino Acid Counts</h3>
          <div className="chart-container">
            <Bar
              data={visualization_data.bar_chart}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {visualization_data.pie_chart && sequence_type !== 'Protein' && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>
            {sequence_type === 'RNA' ? 'GC% vs AU%' : 'GC% vs AT%'}
          </h3>
          <div className="chart-container">
            <Pie
              data={visualization_data.pie_chart}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {visualization_data.line_chart && sequence_type !== 'Protein' && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Sliding Window GC% (window size: 50)</h3>
          <div className="chart-container chart-container-large">
            <Line
              data={visualization_data.line_chart}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Position',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'GC%',
                    },
                    min: 0,
                    max: 100,
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

