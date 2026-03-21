// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Destinations
  DESTINATIONS: `${API_BASE_URL}/destinations`,
  DESTINATION_BY_ID: (id) => `${API_BASE_URL}/destinations/${id}`,
  DESTINATION_SEARCH: `${API_BASE_URL}/destinations/search`,
  DESTINATION_BY_CATEGORY: (category) => `${API_BASE_URL}/destinations/category/${category}`,
  FEATURED_DESTINATIONS: `${API_BASE_URL}/destinations/featured`,
  TOP_RATED_DESTINATIONS: `${API_BASE_URL}/destinations/top-rated`,
  RECENT_DESTINATIONS: `${API_BASE_URL}/destinations/recent`,
  
  // Reviews
  REVIEWS: `${API_BASE_URL}/reviews`,
  REVIEWS_BY_DESTINATION: (id) => `${API_BASE_URL}/reviews/destination/${id}`,
  REVIEWS_BY_USER: (userName) => `${API_BASE_URL}/reviews/user/${userName}`,
  REVIEW_HELPFUL: (id) => `${API_BASE_URL}/reviews/${id}/helpful`,
  
  // Categories
  CATEGORIES: `${API_BASE_URL}/categories`,
  CATEGORIES_POPULAR: `${API_BASE_URL}/categories/popular`,
  CATEGORIES_INIT: `${API_BASE_URL}/categories/init`,
  
  // Favorites
  FAVORITES: `${API_BASE_URL}/favorites`,
  FAVORITES_USER: (userName) => `${API_BASE_URL}/favorites/user/${userName}`,
  FAVORITES_TOGGLE: `${API_BASE_URL}/favorites/toggle`,
  FAVORITES_CHECK: `${API_BASE_URL}/favorites/check`,
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
};

// Helper function for making API requests
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const apiRequestWithAuth = async (url, token, options = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const config = { headers, ...options };
  return await apiRequest(url, config);
};

export default API_ENDPOINTS;
