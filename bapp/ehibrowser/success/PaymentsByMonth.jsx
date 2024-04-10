import React, { useState, useEffect } from 'react';

const EhiView = ({ query }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const sql = `
        SELECT
          STRFTIME('%Y-%m', BC_HX_DATE) AS month,
          SUM(BC_HX_PAYMENT_AMT) AS total_insurance_paid,
          GROUP_CONCAT(DISTINCT BC_HX_INVOICE_NUM) AS invoices,
          GROUP_CONCAT(DISTINCT PROC_NAME) AS procedures
        FROM ARPB_TX_STMCLAIMHX t
        LEFT JOIN CLARITY_EAP p ON t.BC_HX_BO_PROC_ID = p.PROC_ID
        WHERE BC_HX_ASSIGNED_YN = 'Y'
        GROUP BY month
        ORDER BY month DESC;
      `;
      const result = await query(sql);
      setData(result);
      setFilteredData(result);
    };

    fetchData();
  }, [query]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((row) => {
      const description = `Insurance paid $${row.total_insurance_paid.toFixed(2)} in ${row.month} for invoices ${row.invoices} covering procedures ${row.procedures}`;
      return description.toLowerCase().includes(term);
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Insurance Paid</th>
            <th>Invoices</th>
            <th>Procedures</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td>{row.month}</td>
              <td>${row.total_insurance_paid.toFixed(2)}</td>
              <td>{row.invoices}</td>
              <td>{row.procedures}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EhiView;