import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Modal from '../Modal';
import Cart from '../Screens/Cart'; // 👈 correct path
import { useCartState } from './ContextReducer'; // 👈 correct hook

const Navbar = () => {
  const [cartView, setCartView] = useState(false);
  const navigate = useNavigate();
  const cartItems = useCartState();

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">GoFood</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2">
              <li className="nav-item">
                <Link className="nav-link active fs-5" to="/">Home</Link>
              </li>
              {localStorage.getItem("authtoken") && (
                <li className="nav-item">
                  <Link className="nav-link fs-5" to="/myOrder">My Orders</Link>
                </li>
              )}
            </ul>

            {!localStorage.getItem("authtoken") ? (
              <div className='d-flex ms-auto'>
                <Link className="btn bg-white text-success mx-1" to="/login">Login</Link>
                <Link className="btn bg-white text-success mx-1" to="/createuser">Sign up</Link>
              </div>
            ) : (
              <div className="d-flex">
                <button className="btn bg-white text-success mx-2" onClick={() => setCartView(true)}>
                  My Cart <Badge pill bg="danger">{cartItems.length}</Badge>
                </button>

                <button className="btn bg-white text-danger mx-2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Modal for Cart */}
      {cartView && (
        <Modal onClose={() => setCartView(false)}>
          <Cart />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
