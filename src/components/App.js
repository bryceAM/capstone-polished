import { Routes, Route } from 'react-router-dom'
import { default as HomePage } from './HomePage.js'
import '../styles/App.css';

function App() {
  const DB = ``;

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage DB={DB} />} />
        {/* <Route path="/UnderConstruction" element={<UnderConstruction />} /> */}
      </Routes>
    </div>
  );
}

export default App;
