import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn('Token invalid atau kadaluarsa');
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       if (typeof window !== 'undefined') {
//         window.location.href = '/auth/sign-in';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;