import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.js';
import SingleProduct from './SingleProduct.js';
import UnderConstruction from './UnderConstruction.js';
import Header from './Header.js';
import Context from '../context.js';
import '../styles/App.css';

function App() {
  // get this value from localStorage or a key from local storage and database entry. for now set it to a boolean as a placeholder for testing purposes
  const isAdmin = true;
  const contextValues = {
    isAdmin: isAdmin
  };

  return (
    <div className="App">
      <Context.Provider value={contextValues}>
      <Header />
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
