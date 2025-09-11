import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    geolocation: '',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://gofood-mern-pjgu.onrender.com/api/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation,
      }),
    });

    const json = await response.json();
    console.log(json);
    if (!json.success) {
      alert("Enter valid credentials");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card product-card shadow-soft p-4" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2" style={{ color: 'var(--brand-accent)' }}>Create Account</h2>
              <p className="text-muted mb-0">Join us and start ordering delicious food</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control select-control"
                  name="name"
                  value={credentials.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{ height: '48px' }}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control select-control"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  aria-describedby="emailHelp"
                  placeholder="Enter your email"
                  style={{ height: '48px' }}
                />
                <div id="emailHelp" className="form-text text-muted small mt-2">
                  We'll never share your email with anyone else.
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control select-control"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  style={{ height: '48px' }}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="geolocation" className="form-label fw-semibold">
                  Location
                </label>
                <input
                  type="text"
                  className="form-control select-control"
                  name="geolocation"
                  value={credentials.geolocation}
                  onChange={handleChange}
                  placeholder="Enter your location"
                  style={{ height: '48px' }}
                />
              </div>

              <div className="d-grid gap-3">
                <button type="submit" className="btn btn-brand fw-semibold py-2" style={{ height: '48px' }}>
                  Create Account
                </button>
                <Link to="/login" className="btn btn-outline-light fw-semibold py-2" style={{ height: '48px' }}>
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};



export default SignUp;
