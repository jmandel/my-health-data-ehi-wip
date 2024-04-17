import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import EhiNavigator from './EhiNavigator.tsx'
import './index.css'
import {db} from './client.ts'

const App: React.FC = () => {
  return (
      <EhiNavigator ehi={db.ehi} />
  );
};


ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
    <App />
//     <EhiNavigator ehi={db.ehi} />
//   </React.StrictMode>,
)


// export default App;