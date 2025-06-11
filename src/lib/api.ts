import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { logout } from './auth'; // Your logout function

// Replace with your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from cookies if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getCookie('reminderx_access'); // Get access token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // If response is successful, return it
  async (error) => {
    const { response } = error;

    // Check if the error is due to token expiration (401 Unauthorized)
    if (response && response.status === 401 && !response.config._retry) {
      // Mark the request as retried to avoid infinite loop
      response.config._retry = true;

      try {
        // Get the refresh token from cookies
        const refreshToken = getCookie('reminderx_refresh');
        
        if (!refreshToken) {
          // If refresh token is not available, log out the user
          removeCookiesAndLogout();

          // Redirect to login page using window.location.href
          if (typeof window !== 'undefined') {
            window.location.href = '/login'; // Manual redirect
          }
          return Promise.reject(error);
        }

        // Send the refresh token to the backend to get a new access token
        const res = await axios.post(`${API_BASE_URL}/api/token/refresh/`, { refresh: refreshToken });

        // Extract the new access token
        const newAccessToken = res.data.access;

        // Store the new access token in cookies
        setCookie('reminderx_access', newAccessToken, { path: '/' });

        // Retry the failed request with the new access token
        response.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(response.config); // Retry the request

      } catch (refreshError) {
        // If refresh fails (e.g., refresh token expired), log the user out
        removeCookiesAndLogout();

        // Redirect to login page using window.location.href
        if (typeof window !== 'undefined') {
          window.location.href = '/login'; // Manual redirect
        }
      }
    }

    return Promise.reject(error); // Reject the promise with error
  }
);

// Helper function to remove cookies and log the user out
function removeCookiesAndLogout() {
  // Remove access and refresh token cookies
  document.cookie = 'reminderx_access=; Max-Age=0; path=/';
  document.cookie = 'reminderx_refresh=; Max-Age=0; path=/';

  // Optionally, log the user out (you may also want to clear any other session data)
  logout();
}

export default api;
