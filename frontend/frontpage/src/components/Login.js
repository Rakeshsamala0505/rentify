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

  const mediaQueryStyles = `
    .card {
      padding: 40px;
      max-width: 600px;
      background-color: rgba(255, 255, 255, 0.5);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
      border-radius: 30px;
      margin: auto;
    }

    .card-body {
      padding: 20px;
    }

    .form-control {
      font-size: 16px;
      padding: 10px;
    }

    .btn {
      width: 100%;
      padding: 12px 20px;
    }

    .mb-4 {
      margin-bottom: 20px;
    }

    .text-center {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-title {
      font-size: 24px;
      color: blue;
    }

    .form-label {
      font-size: 18px;
      color: black;
      font-weight: bold;
    }

    .alert {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .card {
        padding: 20px;
        max-width: 90vw;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        margin: auto;
      }

      .card-body {
        padding: 10px;
      }

      .form-control {
        font-size: 14px;
        padding: 8px;
      }

      .btn {
        width: 100%;
        padding: 5px 10px;
      }

      .card-title {
        font-size: 22px;
      }

      .form-label {
        font-size: 16px;
      }

      .alert {
        font-size: 14px;
      }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>
        {mediaQueryStyles}
      </style>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card" >
              <div className="card-body">
                <h2 className="card-title text-center" style={{ color: 'blue' }}>Login</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSubmit} >
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label" >Email</label>
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
                    <label htmlFor="password" className="form-label" >Password</label>
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
  backgroundImage: 'url(15.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  fontSize: '18px',
  padding: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  border: 'none',
  borderRadius: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
};

export default Login;
