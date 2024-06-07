import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionsBarChart = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        if (selectedMonth) {
          const response = await axios.get(`http://localhost:3000/bar-chart-data?month=${selectedMonth}`);
          setChartData(response.data);
        }
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  useEffect(() => {
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: "Transactions Bar Chart"
        }
      },
      scales: {
        x: {
          type: 'category',
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Items',
          },
        },
      }
    });
  }, []);

  return (
    <div>
      <h2>Transactions Bar Chart</h2>
      <div>
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">Select</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div>
        {chartData && (
          <div style={{ height: '400px', width: '600px' }}>
            <Bar
              data={{
                labels: chartData.map(dataPoint => dataPoint.range),
                datasets: [{
                  label: 'Number of Items',
                  data: chartData.map(dataPoint => dataPoint.count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                  ],
                  borderWidth: 1,
                }]
              }}
              options={chartOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DefaultChart = () => {
  const [chartData, setChartData] = useState({
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [
        {
          label: "e",
          data: [2, 6, 3, 8, 4, 6, 77]
        }
      ]
    });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: "eh"
        }
      }
    });
  }, []);

  return (
    <div className="Daily">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

const App = () => {
  return (
    <>
      <DefaultChart />
      <TransactionsBarChart />
    </>
  );
};

export default App;
