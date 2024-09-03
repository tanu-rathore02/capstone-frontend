import axios from "axios";


//axios instance
const apiClient = axios.create({
    baseURL: "https://localhost:8080/api",
});


//request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("API Error:", error);
        return Promise.reject(error);
    }
);

export default apiClient;