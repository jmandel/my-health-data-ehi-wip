import * as React from 'react';

export default function EhiView({ query }) {
  const [drugName, setDrugName] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const q = `
        SELECT
          cm.GENERIC_NAME AS Drug_Name,
          mcv.CONTACT_DATE AS Estimate_Time,
          mcd.PAT_PAY_AMT AS Estimated_Cost,
          mcd.PHARMACY_ID_PHARMACY_NAME AS Pharmacy,
          mcd.PHR_TYPE_C_NAME AS Pharmacy_Type,
          mcd.DRUG_STATUS_C_NAME AS Drug_Status,
          mcd.QTY_PRICED AS Quantity_Priced,
          mcd.QTY_PRICED_UNIT_C_NAME AS Quantity_Unit,
          mcd.DAYS_SUPPLY AS Days_Supply,
          mcd.PA_REQ_C_NAME AS Prior_Auth_Required
        FROM MED_CVG_DETAILS mcd
        JOIN MED_CVG_ESTIMATE_VALS mcv ON mcd.MED_ESTIMATE_ID = mcv.MED_ESTIMATE_ID
                                       AND mcd.CONTACT_DATE_REAL = mcv.CONTACT_DATE_REAL
        JOIN MED_CVG_INFO mci ON mcd.MED_ESTIMATE_ID = mci.MED_ESTIMATE_ID
        JOIN ORDER_MED om ON mci.ORDER_ID = om.ORDER_MED_ID
        JOIN CLARITY_MEDICATION cm ON om.MEDICATION_ID = cm.MEDICATION_ID
        WHERE mcd.PAT_PAY_AMT IS NOT NULL
        ${drugName ? `AND cm.GENERIC_NAME LIKE '%${drugName}%'` : ''}
        ${startDate ? `AND mcv.CONTACT_DATE >= '${startDate}'` : ''}
        ${endDate ? `AND mcv.CONTACT_DATE <= '${endDate}'` : ''}
      `;
      const data = await query(q);
      setResults(data);
    };
    fetchData();
  }, [drugName, startDate, endDate, query]);

  return (
    <div>
      <h2>Medication Cost Estimates</h2>
      <div>
        <label>
          Drug Name:
          <input
            type="text"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Drug Name</th>
            <th>Estimate Time</th>
            <th>Estimated Cost</th>
            <th>Pharmacy</th>
            <th>Pharmacy Type</th>
            <th>Drug Status</th>
            <th>Quantity Priced</th>
            <th>Quantity Unit</th>
            <th>Days Supply</th>
            <th>Prior Auth Required</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index}>
              <td>{row.Drug_Name || '-'}</td>
              <td>{row.Estimate_Time || '-'}</td>
              <td>{row.Estimated_Cost || '-'}</td>
              <td>{row.Pharmacy || '-'}</td>
              <td>{row.Pharmacy_Type || '-'}</td>
              <td>{row.Drug_Status || '-'}</td>
              <td>{row.Quantity_Priced || '-'}</td>
              <td>{row.Quantity_Unit || '-'}</td>
              <td>{row.Days_Supply || '-'}</td>
              <td>{row.Prior_Auth_Required || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
