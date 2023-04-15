import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [examples, setExamples] = useState(null);

  useEffect(() => {
    axios.get('/api/example').then((res) => {
      setExamples(res.data);
    }).catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ryflect</h1>
        <div>
          <p><b>Response from backend:</b></p>
          {
            (!examples)? "null" : 
            examples.map((example) => {
              return <p key = {example}>{example.name}, {example.age}</p>;
            })
          }
        </div>
      </header>
    </div>
  );
}

export default App;
