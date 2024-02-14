import { Routes, Route } from 'react-router-dom'
import { default as HomePage } from './HomePage.js'
import Context from '../context.js';
import '../styles/App.css';

function App() {
  const contextValues = {
    DB: `database string placeholder`
  }

  return (
    <div className="App">
      <Context.Provider value={contextValues}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/UnderConstruction" element={<UnderConstruction />} /> */}
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
