import axios from "axios";

const cliente = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

cliente.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
)

export default cliente;