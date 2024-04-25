import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.js';
import SingleProduct from './SingleProduct.js';
import Login from './Login.js';
import UnderConstruction from './UnderConstruction.js';
import Header from './Header.js';
import Context from '../context.js';
import '../styles/App.css';
import { fetchUser, verifyUser } from '../axios-services/index.js';

function App() {
  // get this value from localStorage or a key from local storage and database entry. for now set it to a boolean as a placeholder for testing purposes
  const isAdmin = true;
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    /*
      sets the token with the token from localStorage.
      if there was a token to be set from localStorage, then call the function to set the user.
    */
    const token = localStorage.getItem('token');
    
    setToken(token);

    const initUser = async () => {
      let username = '';
      let user = {};

      try {
        const verifiedUser = await verifyUser(token);
        username = verifiedUser.username;
      } catch (err) {
        console.error(err);
      };

      try {
        user = await fetchUser(username);
      } catch (err) {
        console.error(err);
      };

      setUser(user);
    };

    if (token) {
      initUser();
    };
  }, []);

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
          <Route path="/login" element={<Login token={token} setToken={setToken} setUser={setUser} />} />
          <Route path="/products/:productId" element={<SingleProduct user={user} />} />
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
