import React from "react";
import _ from "lodash";

export default function EhiView({ query }) {
  const [meds, setMeds] = React.useState([]);
  const [yearFilter, setYearFilter] = React.useState(new Date().getFullYear());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchMeds = async () => {
      setLoading(true);
      try {
        const rows = await query(`
          SELECT
            m.MEDICATION_ORDER_ID,
            m.TAKING_YN
          FROM
            MEDS_REV_LAST_LIST m
            JOIN MEDS_REV_HX h ON m.PAT_ID = h.PAT_ID
          WHERE
            h.MEDS_HX_REV_INSTANT BETWEEN '${yearFilter}-01-01' AND '${yearFilter}-12-31'
        `);
        setMeds(rows);
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, [yearFilter, query]);

  return (
    <div>
      <h2>Medications for Year</h2>
      <select value={yearFilter} onChange={(e) => setYearFilter(parseInt(e.target.value))}>
        {_.range(new Date().getFullYear() - 5, new Date().getFullYear() + 1).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {loading ? (
        <p>Loading medications...</p>
      ) : meds.length === 0 ? (
        <p>No medications found for the selected year.</p>
      ) : (
        <ul>
          {meds.map((med, index) => (
            <li key={index}>
              Medication ID: {med.MEDICATION_ORDER_ID} - Taking: {med.TAKING_YN === 'Y' ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}