import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
