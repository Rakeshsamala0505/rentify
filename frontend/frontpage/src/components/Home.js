//home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom

const Home = () => {
  const homeStyle = {
    backgroundImage: 'url("/bg_image.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'yellow',
    textAlign: 'center',
    padding: '20px', // Add padding for better spacing
  };

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px', // Add padding for better spacing
  };

  return (
    <div className='container-fluid' style={homeStyle}>
      <div className="row justify-content-center align-items-center" style={overlayStyle}>
      <div className="col-12">
        <h1 className="mb-2" style={{ fontSize: '2.5rem' }}>Welcome to Rentify</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
        Welcome to Rentify, your ultimate platform for renting homes and 
        hotel rooms is here! Discover a wide range of options tailored to your needs,
         whether you're looking for a home or a comfortable hotel room.
          Rentify makes it easy for buyers to find the perfect place and for 
          sellers to list their properties effortlessly. Join Rentify today and
           experience a seamless, enjoyable rental journey. With Rentify, renting 
           homes and hotel rooms has never been easier!
        </p>
        <div className="d-flex justify-content-center">
        <Link to="/login">
          <button className="btn btn-primary btn-lg mx-1">Signin</button>
          </Link>
          <Link to="/signup"> {/* Use Link component to navigate to /signup */}
            <button className="btn btn-secondary btn-lg mx-1">Signup</button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
