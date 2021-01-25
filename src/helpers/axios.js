import axios from "axios";
import authFetch from "./authFetch";

const axiosConfig = () => {
  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${window.localStorage.getItem("token")}`;
    return config;
  });

  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      console.log(error.response);
      if (error.response.status === 403) {
        window.localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 401 && window.localStorage.getItem("refresh-token")) {
        authFetch("/auth/refresh", { method: "POST", body: window.localStorage.getItem("refresh-token") })
          .then((response) => {
            if (response.data.token) {
              window.localStorage.setItem("token", response.data.token);
              window.localStorage.setItem("refresh-token", response.data.refreshToken);
            }
          })
          .catch((err) => {
            window.localStorage.removeItem("token");
            window.location.href = "/login";
          });
      } else {
        return Promise.reject(error);
      }
    }
  );
};

export default axiosConfig;
