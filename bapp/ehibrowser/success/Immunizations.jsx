import React, { useState, useEffect } from 'react';

const EhiView = ({ query }) => {
  const [immunizations, setImmunizations] = useState([]);
  const [selectedImmunization, setSelectedImmunization] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const patientData = await query('SELECT * FROM PATIENT');
      const patientId = patientData[0].PAT_ID;

      const immunizationData = await query(`
        SELECT p.PAT_NAME, pi.IMMUNE_ID, ih.LINE, ih.IMMNZTN_HX_DATE, ih.IMM_TYPE_HIST_ID_NAME
        FROM PATIENT p
        JOIN PAT_IMMUNIZATIONS pi ON p.PAT_ID = pi.PAT_ID
        JOIN IMMUNE_HISTORY ih ON pi.IMMUNE_ID = ih.IMMUNE_ID
        WHERE p.PAT_ID = '${patientId}'
        ORDER BY ih.IMMNZTN_HX_DATE DESC;
      `);

      setImmunizations(immunizationData);
      setSelectedImmunization(immunizationData[0] || null);
    };

    fetchData();
  }, [query]);

  return (
    <div>
      <h2>Immunization History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Immunization</th>
          </tr>
        </thead>
        <tbody>
          {immunizations.map((immunization) => (
            <tr
              key={`${immunization.IMMUNE_ID}-${immunization.LINE}`}
              onClick={() => setSelectedImmunization(immunization)}
              style={{ cursor: 'pointer', backgroundColor: selectedImmunization === immunization ? 'lightgray' : 'transparent' }}
            >
              <td>{immunization.IMMNZTN_HX_DATE}</td>
              <td>{immunization.IMM_TYPE_HIST_ID_NAME}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedImmunization && (
        <div>
          <h3>Selected Immunization Details</h3>
          <p>Patient Name: {selectedImmunization.PAT_NAME}</p>
          <p>Immunization: {selectedImmunization.IMM_TYPE_HIST_ID_NAME}</p>
          <p>Date: {selectedImmunization.IMMNZTN_HX_DATE}</p>
        </div>
      )}
    </div>
  );
};

export default EhiView;