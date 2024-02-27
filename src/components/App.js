import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.js';
import SingleProduct from './SingleProduct.js';
import UnderConstruction from './UnderConstruction.js';
import Context from '../context.js';
import '../styles/App.css';

function App() {
  const contextValues = {
    PlaceHolder: `remove and replace with your context values`
  }

  return (
    <div className="App">
      <Context.Provider value={contextValues}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/UnderConstruction" element={<UnderConstruction />} />
          <Route path="/products/:productId" element={<SingleProduct />} />
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
