import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/axiosInstance';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (email, password) => {
                const response = await api.post('/auth/login', { email, password });
                set({ user: response.data, token: response.data.token, isAuthenticated: true });
                return response.data;
            },
            register: async (userData) => {
                const response = await api.post('/auth/register', userData);
                set({ user: response.data, token: response.data.token, isAuthenticated: true });
                return response.data;
            },
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;
