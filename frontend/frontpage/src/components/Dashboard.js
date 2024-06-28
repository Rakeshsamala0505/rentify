//dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const firstName = localStorage.getItem('firstName');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate('/login'); // Redirect to login if no token found
          return;
        }
        const response = await axios.get('https://rentify-1-7fs6.onrender.com/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login'); // Token might be expired or invalid
        } else if (error.response) {
          setError(error.response.data.error);
        } else {
          setError('An error occurred while fetching data. Please try again.');
        }
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  const handleBuyerClick = () => {
    navigate('/properties');
  };

  const backgroundImage = "url('15.jpg')"; // replace with your image URL
  const mediaQueryStyles = `
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 20px; /* Adjust padding for better fit */
      max-width: 100vw;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
      border-radius: 20px;
      margin: 0;
    }

    .dashboard-content {
      padding: 10px; /* Adjust padding for better fit */
      font-size: 20px;
    }

    .dashboard-title {
      font-size: 20px;
    }

    .dashboard-description {
      font-size: 20px;
    }

    .dashboard-button {
      padding: 5px 10px;
      font-size: 14px;
      border-radius: 10px;
    }

    .first-name {
      font-size: 20px;
    }
  }
`;
  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (!data) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'purple'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center" 
      style={{
        height: '100vh', 
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',

      }}
    >
      <style>
        {mediaQueryStyles}
      </style>
      <div className="row justify-content-center w-100">
        <div 
          className="col-12 col-md-8 text-center p-4 dashboard-container" 
          style={{ 
            maxWidth: '600px', 
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Make the card background transparent
            boxShadow: '0 4px 8px rgba(0, 0, 0, 1)',
            borderRadius: '20px', // Ensure this is set for larger screens as well
            padding: '20px', 
          }}
        >
         <h1 className="mb-4 dashboard-title" style={{ fontSize: '20px' }}>
             Welcome to Rentify <span style={{ color: 'blue', fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>{firstName}</span>
         </h1>

          <p className="mb-4 dashboard-description" style={{ fontSize: '20px', margin: '0px' }}>
            Choose whether you are a seller or a buyer to proceed.
            You can either sell or rent a property by clicking the buttons below.
          </p>
          <div className="mt-4 d-flex justify-content-center dashboard-content">
            <button onClick={handleAddProperty}
              className="btn btn-primary dashboard-button" 
              style={{ padding: '10px 30px', fontSize: '18px', marginRight: '20px' }}
            >
              Seller
            </button>
            <button onClick={handleBuyerClick}
              className="btn btn-secondary dashboard-button" 
              style={{ padding: '10px 30px', fontSize: '18px', marginLeft: '20px' }}
            >
              Buyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
