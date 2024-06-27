import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    place: '',
    area: '',
    bedrooms: '',
    restrooms: '',
    cost: '',
    image: null
  });
  const [properties, setProperties] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    try {
      const response = await axios.get('https://rentify-1-7fs6.onrender.com/api/properties/user', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchProperties();
    }
  }, [token, navigate, fetchProperties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await axios.post('https://rentify-1-7fs6.onrender.com/api/properties', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      if (response.data.success) {
        setSuccessMessage('Property added successfully!');
        setFormData({
          place: '',
          area: '',
          bedrooms: '',
          restrooms: '',
          cost: '',
          image: null
        });
        e.target.reset();
        fetchProperties();
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
      } else {
        alert('Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://rentify-1-7fs6.onrender.com/api/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        fetchProperties();
        setSuccessMessage('Property deleted successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const labelStyle = {
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bolder'
  };

  return (
    <div className="container mt-3">
      <div className="card p-5" style={{ maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 1)', borderRadius: '20px' }}>
        <h2 className="mb-2 card-title text-center">Add Property</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label htmlFor="place" className="form-label" style={labelStyle}>Location:</label>
            <input type="text" className="form-control" id="place" name="place" value={formData.place} onChange={handleChange} required />
          </div>
          <div className="mb-1">
            <label htmlFor="area" className="form-label" style={labelStyle}>Area:</label>
            <input type="text" className="form-control" id="area" name="area" value={formData.area} onChange={handleChange} required />
          </div>
          <div className="mb-1">
            <label htmlFor="bedrooms" className="form-label" style={labelStyle}>Bedrooms:</label>
            <input type="number" className="form-control" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
          </div>
          <div className="mb-1">
            <label htmlFor="restrooms" className="form-label" style={labelStyle}>Restrooms:</label>
            <input type="number" className="form-control" id="restrooms" name="restrooms" value={formData.restrooms} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="cost" className="form-label" style={labelStyle}>Cost:</label>
            <input type="number" className="form-control" id="cost" name="cost" value={formData.cost} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label" style={labelStyle}>Upload Image:</label>
            <input type="file" className="form-control" id="image" name="image" onChange={handleFileChange} required />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 50px' }}>Add Property</button>
            <button type="button" className="btn btn-secondary" style={{ padding: '10px 50px' }} onClick={() => navigate('/PropertyList')}>Buy Property</button>
          </div>
        </form>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      </div>

      {properties.length > 0 && (
        <div className="mt-5">
          <h3 style={{ fontSize: '40px', color: 'red' }}>Your Properties</h3>
          <ul className="list-group">
          {properties.map((property) => (
  <li key={property._id} className="list-group-item d-flex justify-content-between align-items-center">
    <strong>Location: {property.place}, Area: {property.area}, Bedrooms: {property.bedrooms}, Restrooms: {property.restrooms}, Price: Rs {property.cost}</strong>
    <img src={`https://rentify-1-7fs6.onrender.com/uploads/${property.image}`} alt={property.place} style={{ width: '100px', height: '100px' }} />
    <button onClick={() => handleDelete(property._id)} className="btn btn-danger">Delete</button>
  </li>
))}

          </ul>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
