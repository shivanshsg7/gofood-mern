import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
const Login = () => {
  const [credentials, setCredentials] = useState({


    email: '',
    password: '',

  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        email: credentials.email,
        password: credentials.password,

      }),
    });

    const json = await response.json();
    console.log(json);
    if (!json.success) {
      alert("Enter valid credentials");
    }
    if (json.success) {
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem('authtoken', json.authToken);
      console.log(localStorage.getItem('authtoken') );
      navigate("/");
    }
  };
  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card product-card shadow-soft p-4" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2" style={{ color: 'var(--brand-accent)' }}>Welcome Back</h2>
              <p className="text-muted mb-0">Sign in to your account</p>
            </div>
            
            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  style={{ height: '48px' }}
                />
              </div>

              <div className="d-grid gap-3">
                <button type="submit" className="btn btn-brand fw-semibold py-2" style={{ height: '48px' }}>
                  Sign In
                </button>
                <Link to="/createuser" className="btn btn-outline-light fw-semibold py-2" style={{ height: '48px' }}>
                  Create New Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
