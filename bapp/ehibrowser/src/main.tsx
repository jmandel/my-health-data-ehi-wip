import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { renderComponentInBackground } from './util'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// renderComponentInBackground(`function EhiView({ query }) {
//   const [data, setData] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);
//   const [patientName, setPatientName] = React.useState('');
//   const [startDate, setStartDate] = React.useState('');
//   const [endDate, setEndDate] = React.useState('');

//   React.useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const patientQuery = \`
//           SELECT PAT_NAME
//           FROM PATIENT
//           LIMIT 1;
//         \`;
//         const patientResult = await query(patientQuery) || [{PAT_NAME: ''}];
//         setPatientName(patientResult[0].PAT_NAME || '');

//         const medsQuery = \`
//           SELECT p.PAT_NAME, pmh.MEDS_HX_ID, pmh.LINE
//           FROM PATIENT p
//           JOIN PAT_MEDS_HX pmh ON p.PAT_ID = pmh.PAT_ID
//           WHERE p.PAT_NAME = '\${patientResult[0].PAT_NAME || ''}';
//         \`;
//         const medsResult = await query(medsQuery);
//         setData(medsResult);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [query]);

//   const handleDateChange = (event, type) => {
//     if (type === 'start') {
//       setStartDate(event.target.value);
//     } else {
//       setEndDate(event.target.value);
//     }
//   };

//   const filteredData = startDate || endDate
//     ? data.filter((row) => {
//         // Implement date filtering logic here
//         return true;
//       })
//     : data;

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div>
//       <h1>Patient Medication History</h1>
//       <p>Patient Name: {patientName}</p>
//       <div>
//         <label htmlFor="startDate">Start Date:</label>
//         <input
//           type="date"
//           id="startDate"
//           value={startDate}
//           onChange={(e) => handleDateChange(e, 'start')}
//         />
//         <label htmlFor="endDate">End Date:</label>
//         <input
//           type="date"
//           id="endDate"
//           value={endDate}
//           onChange={(e) => handleDateChange(e, 'end')}
//         />
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Patient Name</th>
//             <th>Medication ID</th>
//             <th>Line</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((row, index) => (
//             <tr key={index}>
//               <td>{row.PAT_NAME}</td>
//               <td>{row.MEDS_HX_ID}</td>
//               <td>{row.LINE}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }`)

