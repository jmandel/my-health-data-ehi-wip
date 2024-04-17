import React, { useState, useEffect } from 'react';
import { transform } from '@babel/standalone';
import { queryToRows, renderComponentInBackground } from './util';
import * as agent from './agent';
import _ from 'lodash';
import {db} from './client.ts'
import { ErrorBoundary } from './util';
// import { JSDOM } from 'jsdom';


const App = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [componentCode, setComponentCode] = useState(`
    function EhiView({query}) {
      return <div>Enter your component code here</div>;
    }
  `);

  
  async function begin(userQuestion: string){
    if (!userQuestion) {
      return;
    }
      // const userQuestion = "What are the patient's past and future vaccine administrations?";
      const newComponent = await agent.answerQuestionWithComponent(userQuestion);
      setComponentCode(newComponent);

    return;
  }

  const [renderedComponent, setRenderedComponent] = useState<JSX.Element|null>(null);
  const [error, setError] = useState(null);

  const handleCodeChange = (event) => {
    setComponentCode(event.target.value);
  };

  useEffect(() => {
    const renderComponent = async () => {
      try {
        try {
          await renderComponentInBackground(componentCode)
          console.log("OK IN BG");
        } catch (err) {
          console.log("ERRR IN BG", err);
        } 

        const transpiledCode = transform(componentCode, {
          presets: ['react'],
        }).code;

        const evalComponent = new Function("React", "_", 'db', transpiledCode + " return EhiView;");
        const NewComponent = evalComponent(React, _, db);
        let renderedElement = React.createElement(NewComponent, {});
        console.log(renderedElement)
        setRenderedComponent(renderedElement);
        setError(null);

        } catch(err){
          console.log("ERRROR", err.toString());
          setRenderedComponent(null);
          setError(err);
        }

    };

    renderComponent()
  }, [componentCode]);

  return (
    <>
    <input type="text" value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} />
    <button onClick={() => begin(userQuestion)}>Ask</button>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Component Code</h2>
        <textarea
          value={componentCode}
          onChange={handleCodeChange}
          style={{ width: '100%', height: '400px' }}
        />
      </div>
      <ErrorBoundary>
<div style={{ flex: 1, padding: '20px' }}>
        <h2>Rendered Component</h2>
        {error ? (
          <div style={{ color: 'red' }}>
            Error: {error.message}
          </div>
        ) : (
          renderedComponent
        )}
      </div>
      </ErrorBoundary>
      
    </div>
  </>
  );
};

export default App;

