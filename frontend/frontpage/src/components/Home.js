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
    color: 'white',
    textAlign: 'center',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={homeStyle}>
      <div style={overlayStyle}>
        <h1 className="mb-4" style={{ fontSize: '50px' }}>Welcome to Rentify</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '20px', margin: '0 auto', padding:'40px' }}>
        Welcome to Rentify, your ultimate platform for renting homes and 
        hotel rooms is here! Discover a wide range of options tailored to your needs,
         whether you're looking for a home or a comfortable hotel room.
          Rentify makes it easy for buyers to find the perfect place and for 
          sellers to list their properties effortlessly. Join Rentify today and
           experience a seamless, enjoyable rental journey. With Rentify, renting 
           homes and hotel rooms has never been easier!
        </p>
        <div className="d-flex gap-3">
        <Link to="/login">
          <button className="btn btn-primary" style={{ fontSize: '2.0rem', padding: '20px 45px' }}>Signin</button>
          </Link>
          <Link to="/signup"> {/* Use Link component to navigate to /signup */}
            <button className="btn btn-secondary" style={{ fontSize: '2.0rem', padding: '20px 40px' }}>Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
