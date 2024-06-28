//Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSuccessMessage('');
      return;
    }
    try {
      console.log('Sending request:', formData);  // Log the request data
      const response = await axios.post('https://rentify-1-7fs6.onrender.com/api/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      console.log('Response received:', response.data);  // Log the response data
      setSuccessMessage('User created successfully');
      setError('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error:', error);  // Log the error
      setSuccessMessage('');

      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);

        if (error.response.status === 409) {
          setError('User already exists with this email');
        } else {
          setError('An error occurred during signup. Please try again.');
        }
      } else {
        setError('An error occurred during signup. Please try again.');
        console.log('Error message:', error.message);
      }
    }
  };

  const labelStyle = {
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bolder'
  };
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(13.jpg)', // Path to your background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden'
  };

  const cardStyle = {
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 1)',
  };

  const mediaQueryStyles = `
  @media (max-width: 768px) {
    .card {
      width: 100%;
      padding: 10px;
      margin: 0; /* Remove any extra margin */
      height: auto; /* Allow card height to adjust */
    }

    .card-body {
      padding: 6px; /* Reduce padding inside card body */
    }

    .form-control {
      font-size: 12px;
      padding: 4px; /* Further reduce padding inside input fields */
      height: 20px;

    }

    .btn {
      width: 100%;
      padding: 4px 8px; /* Further reduce button padding */
    }

    .mb-3 {
      margin-bottom: 5px; /* Reduce margin between form groups */
    }

    .text-center {
      display: flex;
      flex-direction: column;
      gap: 5px; /* Reduce gap between elements */
    }

    .card-title {
      font-size: 20px; /* Reduce font size of card title */
    }
    
    .form-label {
      font-size: 12px; /* Reduce font size of form labels */
    }

    .alert {
      font-size: 12px; /* Reduce font size of alerts */
      padding: 4px; /* Reduce padding inside alerts */
    }
  }
`;

  return (
    <div className="container-fluid" style={containerStyle}>
       <style>
        {mediaQueryStyles}
      </style>
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card" style={cardStyle}>
            <div className="card-body">
              <h2 className="card-title text-center" style={{ color: 'blue' }}>Sign Up</h2>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label" style={labelStyle}>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label" style={labelStyle}>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
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
                  <label htmlFor="phoneNumber" className="form-label" style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    pattern="[0-9]{10}" // Restrict input to 10 digits
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
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
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label" style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 30px', marginRight: '10px' }}>Submit</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '10px 30px' }} onClick={() => navigate('/login')}>Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
