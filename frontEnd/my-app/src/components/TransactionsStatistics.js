import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsStatistics = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [statistics, setStatistics] = useState(null);

  // Fetch statistics data when selectedMonth changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedMonth) {
          const response = await axios.get(`http://localhost:3000/sales-statistics?month=${selectedMonth}`);
          setStatistics(response.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <div>
      <h2>Transactions Statistics</h2>
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
        {statistics && (
          <div>
            <h3>Statistics for {selectedMonth}</h3>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsStatistics;
