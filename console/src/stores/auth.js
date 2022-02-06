import create from 'zustand';
import axios from 'axios';


const useAuth = create((set, get) => ({
    tokens: null,
    login: (data) => {
        set({ tokens: data });
        sessionStorage.setItem('access_token', data.access_token);
        axios.defaults.headers.Authorization = `Bearer ${get().tokens.access_token}`
    },
    logout: () => {
        set({ tokens: null });
        sessionStorage.removeItem('access_token');
    },
    isAuthenticated: () => get().tokens?.access_token || sessionStorage.access_token,
  }));


export default useAuth
