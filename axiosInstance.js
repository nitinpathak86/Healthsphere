import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem('auth-storage'));
        if (auth && auth.state && auth.state.token) {
            config.headers.Authorization = `Bearer ${auth.state.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
