import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from './config.js';

function App() {
  const [examples, setExamples] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/example`).then((res) => {
      return res.data;
    }).then((data) => {
      setExamples(data);
    }).catch((err) => console.error(err.response.data.error));
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
              return <p key = {example._id}>{example.name}, {example.age}</p>;
            })
          }
        </div>
      </header>
    </div>
  );
}

export default App;
