import * as React from "react";

export default EhiView;
function EhiView({query}) {
  const [includePending, setIncludePending] = React.useState(false);
  const [payorFilter, setPayorFilter] = React.useState('');
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    let q = `
      SELECT
        ROUND(AVG(CAST(julianday(stm.BC_HX_PAYMENT_DATE) - julianday(tx.CLAIM_DATE) AS INTEGER)), 1) AS avg_days_to_payment,
        ROUND(MIN(CAST(julianday(stm.BC_HX_PAYMENT_DATE) - julianday(tx.CLAIM_DATE) AS INTEGER)), 1) AS min_days_to_payment,    
        ROUND(MAX(CAST(julianday(stm.BC_HX_PAYMENT_DATE) - julianday(tx.CLAIM_DATE) AS INTEGER)), 1) AS max_days_to_payment,
        epm.PAYOR_NAME,
        COUNT(*) AS num_claims,
        strftime('%Y', tx.CLAIM_DATE) AS service_year
      FROM ARPB_TX_STMCLAIMHX stm
      JOIN ARPB_TRANSACTIONS tx ON stm.TX_ID = tx.TX_ID  
      LEFT JOIN CLARITY_EPM epm ON tx.ORIGINAL_EPM_ID = epm.PAYOR_ID
      WHERE tx.CLAIM_DATE IS NOT NULL
    `;

    if (!includePending) {
      q += ' AND stm.BC_HX_PAYMENT_DATE IS NOT NULL';
    }
  
    if (payorFilter) {
      q += ` AND epm.PAYOR_NAME LIKE '%${payorFilter}%'`;
    }
  
    q += ' GROUP BY epm.PAYOR_NAME, service_year';
  
    query(q).then(setResults);
  }, [includePending, payorFilter]);

  return (
    <div>
      <h2>Days to Payment by Payor and Service Year</h2>
      
      <label>
        <input type="checkbox" checked={includePending} onChange={e => setIncludePending(e.target.checked)} />
        Include pending claims
      </label>
  
      <label>
        Payor filter:
        <input value={payorFilter} onChange={e => setPayorFilter(e.target.value)} /> 
      </label>
  
      <table>
        <thead>
          <tr>
            <th>Payor</th>
            <th>Service Year</th>
            <th>Avg Days to Payment</th>
            <th>Min Days to Payment</th>
            <th>Max Days to Payment</th>
            <th>Number of Claims</th>
          </tr>
        </thead>
        <tbody>
          {results.map(row => (
            <tr key={`${row.PAYOR_NAME}-${row.service_year}`}>
              <td>{row.PAYOR_NAME || 'UNKNOWN'}</td>
              <td>{row.service_year}</td>
              <td>{row.avg_days_to_payment}</td>
              <td>{row.min_days_to_payment}</td>
              <td>{row.max_days_to_payment}</td>
              <td>{row.num_claims}</td>
            </tr>
          ))}  
        </tbody>
      </table>
      
    </div>
  );
}