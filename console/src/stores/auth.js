import create from 'zustand';


const useAuth = create((set, get) => ({
    tokens: null,
    login: (data) => {
        set({ tokens: data });
        sessionStorage.setItem('access_token', data.access_token);
    },
    logout: () => {
        set({ tokens: data });
        sessionStorage.removeItem('access_token');
    },
    isAuthenticated: () => get().tokens?.access_token || sessionStorage.access_token,
  }));


export default useAuth
