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
        const response = await axios.get('http://localhost:3000/api/dashboard', {
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

  const backgroundImage = "url('login_bg.jpg')"; // replace with your image URL

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
      <div className="row justify-content-center w-100">
        <div 
          className="col-12 col-md-8 text-center p-5 rounded" 
          style={{ 
            maxWidth: '600px', 
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Make the card background transparent
            boxShadow: '0 4px 8px rgba(0, 0, 0, 1)' 
          }}
        >
         <h1 className="mb-4">
             Welcome to Rentify <span style={{ color: 'blue', fontSize: '40px', fontWeight: 'bold', textTransform: 'uppercase' }}>{firstName}</span>
         </h1>

          <p className="mb-4" style={{ fontSize: '20px' }}>
            Choose whether you are a seller or a buyer to proceed.
            You can either sell or rent a property by clicking the buttons below.
          </p>
          <div className="mt-4 d-flex justify-content-center">
            <button onClick={handleAddProperty}
              className="btn btn-primary" 
              style={{ padding: '15px 30px', fontSize: '18px', marginRight: '20px' }}
            >
              Seller
            </button>
            <button onClick={handleBuyerClick}
              className="btn btn-secondary" 
              style={{ padding: '15px 30px', fontSize: '18px', marginLeft: '20px' }}
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
