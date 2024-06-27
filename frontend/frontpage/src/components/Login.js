import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://rentify-1-7fs6.onrender.com/api/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('firstName', user.firstName);

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <h2 className="card-title text-center" style={{ color: 'blue' }}>Login</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSubmit} style={formStyle}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label" style={labelStyle}>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={labelStyle}>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                  </div>
                  <div className="text-center mt-3">
                    <p>
                      Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: 'url(dashboard.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  fontSize:'18px'
};

const cardStyle = {
  padding: '60px',
  maxWidth: '600px',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 1)',
  borderRadius:'30px'
};

const formStyle = {
  width: '100%'
};

const labelStyle = {
  color: 'black',
  fontStyle: 'normal',
  fontWeight: 'bolder',
  fontSize:'18px'

};

export default Login;
