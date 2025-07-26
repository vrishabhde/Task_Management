const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

if (!API_BASE_URL) {
  console.error('API_BASE_URL is not defined. Please check your .env file.');
}

console.log(API_BASE_URL,"API_BASE_URL")
export const getApiUrl = (endpoint) => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined. Please check your .env file.');
  }
  return `${API_BASE_URL}${endpoint}`;
};

export default {
  getApiUrl,
  API_BASE_URL
}; 