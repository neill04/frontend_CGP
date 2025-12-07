import axios, { AxiosError } from "axios";

export const TOKEN_KEY = "BEARER_TOKEN";

const cliente = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

cliente.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

cliente.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status;
        const isLoginPage = window.location.pathname === "/signin";

        if (status === 401 && !isLoginPage) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
)

export default cliente;