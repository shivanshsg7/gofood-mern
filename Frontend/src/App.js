import './App.css';
import Home from './Screens/Home';
import Login from './Screens/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

// ✅ Bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './Screens/SignUp.jsx';
import {CartProvider} from './component/ContextReducer';
import MyOrder from './Screens/MyOrder.jsx';

function App() {
  return (
    <CartProvider>
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createuser" element={<SignUp />} />
          <Route exact path="/myOrder" element={<MyOrder />} />
      
        </Routes>
        
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
