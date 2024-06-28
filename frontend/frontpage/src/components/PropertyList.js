//propertylist.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    place: '',
    area: '',
    bedrooms: '',
    restrooms: '',
    cost: ''
  });
  const [sortOrder, setSortOrder] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = localStorage.getItem('token');
      setToken(savedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://rentify-1-7fs6.onrender.com/api/properties');
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error.message);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleInterestedClick = useCallback(async (property) => {
    setLoading(true);
  
    try {
      const response = await axios.get(`https://rentify-1-7fs6.onrender.com/api/properties/${property._id}/seller`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const userDetails = response.data.user;
      const message = response.data.message;
  
      setSelectedProperty({ property, userDetails, message });
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  const handleLikeClick = async (propertyId) => {
    try {
      const response = await axios.post(`https://rentify-1-7fs6.onrender.com/api/properties/${propertyId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedLikeCount = response.data.likeCount;
      
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property._id === propertyId
            ? { ...property, likeCount: updatedLikeCount, likedByCurrentUser: !property.likedByCurrentUser }
            : property
        )
      );
    } catch (error) {
      console.error('Error liking property:', error.message);
    }
  };
  

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const handleAddPropertyClick = () => {
    navigate('/AddProperty');
  };

  const filteredProperties = properties.filter((property) => {
    return (
      (!filters.place || property.place.toLowerCase().includes(filters.place.toLowerCase())) &&
      (!filters.area || property.area.toLowerCase().includes(filters.area.toLowerCase())) &&
      (!filters.bedrooms || property.bedrooms === parseInt(filters.bedrooms, 10)) &&
      (!filters.restrooms || property.restrooms === parseInt(filters.restrooms, 10)) &&
      (!filters.cost || parseFloat(property.cost) <= parseFloat(filters.cost))
    );
  });

  const sortedProperties = sortOrder === 'lowToHigh'
    ? filteredProperties.slice().sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost))
    : sortOrder === 'highToLow'
      ? filteredProperties.slice().sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost))
      : filteredProperties;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Welcome to Rentify</h1>
    
      <div className="row mb-5">
        <div className="col-12 col-sm-6 col-md-4 mb-2 mb-md-0">
          <input
            type="text"
            name="place"
            placeholder="Filter by Place"
            className="form-control"
            value={filters.place}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
          <input
            type="text"
            name="area"
            placeholder="Filter by Area"
            className="form-control"
            value={filters.area}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
          <input
            type="number"
            name="bedrooms"
            placeholder="Filter by Bedrooms"
            className="form-control"
            value={filters.bedrooms}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
          <input
            type="number"
            name="restrooms"
            placeholder="Filter by Restrooms"
            className="form-control"
            value={filters.restrooms}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-12 col-sm-6 col-md-2">
          <select className="form-select" value={sortOrder} onChange={handleSortChange}>
            <option value="" disabled>Sort by Price</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>
      {/* Button placed among filters on mobile screens */}
      <div className="row d-sm-block d-md-none mb-3">
        <div className="col-12">
          <button
            className="btn btn-primary w-100"
            onClick={handleAddPropertyClick}
          >
            Add Property
          </button>
        </div>
      </div>

      {/* Button fixed to top right on larger screens */}
      <button
        className="btn btn-primary d-none d-md-block position-fixed top-0 end-0 m-3"
        style={{ zIndex: 1000 }}
        onClick={handleAddPropertyClick}
      >
        Add Property
      </button>

      <div className="row">
        {sortedProperties.map(property => (
          <div className="col-md-4 mb-4" key={property._id}>
            <div className="card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 1)', borderRadius: "20px" }}>
              <img
                src={`https://rentify-1-7fs6.onrender.com/${property.image}`}
                className="card-img-top"
                alt={property.place}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex justify-content-between align-items-center" style={{ position: 'relative' }}>
                <div style={{ marginRight: '10px' }}>
                  <h5 className="card-title fs-3"> {property.place}</h5>
                  <p className="card-text"><i className="fas fa-map-marker-alt"></i>  {property.area}</p>
                  <p className="card-text"><i className="fas fa-bed"></i> {property.bedrooms} <strong>Bedrooms</strong></p>
                  <p className="card-text"><i className="fas fa-bath"></i> {property.restrooms} <strong>Restrooms</strong></p>
                  <p className="card-text"><i className="fas fa-indian-rupee-sign"></i> {property.cost}<strong>/month</strong></p>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', marginTop: '-140px', position: 'absolute', right: '10px' }}
                  onClick={() => handleInterestedClick(property)}
                >
                  I'm Interested
                </button>
                <button
                 className="btn btn-light"
                 style={{ padding: '10px', position: 'absolute', right: '10px', top: '140px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 onClick={() => handleLikeClick(property._id)}>
                  <i id={`like-icon-${property._id}`} className={`fa${property.likes.includes(token) ? 's' : 'r'} fa-heart`} style={{ color: property.likes.includes(token) ? 'red' : 'black' }}></i>
                </button>

                <div style={{ position: 'absolute', right: '10px', top: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-heart" style={{ color: 'red' }}></i>
                  <span>{property.likeCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

{loading && (
  <div className="loading-overlay" style={loadingOverlayStyle}>
    <div className="loading-text" style={loadingTextStyle}>Fetching Seller Details...</div>
  </div>
)}

{selectedProperty && (
  <div className="modal-overlay" onClick={handleCloseModal} style={overlayStyle}>
    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={modalDialogStyle}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" style={{ marginLeft: '120px', marginBottom: '20px' }}>Seller Details</h5>
          <button type="button" className="close" onClick={handleCloseModal}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {selectedProperty.message ? (
            <div className="overlay-message" style={{ textAlign: 'center' }}>
              <p>{selectedProperty.message}</p>
            </div>
          ) : (
            <>
              <p><strong>Name:</strong> {selectedProperty.userDetails?.firstName} {selectedProperty.userDetails?.lastName}</p>
              <p><strong>Email:</strong> {selectedProperty.userDetails?.email}</p>
              <p><strong>Phone:</strong> {selectedProperty.userDetails?.phoneNumber}</p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

const loadingOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
};

const loadingTextStyle = {
  color: '#fff',
  fontSize: '24px',
  fontWeight: 'bold',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
};

const modalDialogStyle = {
  backgroundColor: '#fff',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  width: '400px',
  maxWidth: '100%',
  height: 'auto',
  maxHeight: '90%',
  overflowY: 'auto',
};

export default PropertiesList;
