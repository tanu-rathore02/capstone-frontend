import axios from "axios";
import { BASE_URL } from "./ApiConstants";


const getToken = () => localStorage.getItem("token");

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
   
      window.location.href = "/";
    } else {
      console.error("Response error:", error);
    }
    return Promise.reject(error);
  }
);


export const postRequestWithoutAuth = (api, payloads, callback) => {
  axios
    .post(BASE_URL + api, payloads)
    .then((res) => {
      if (res?.status === 200 || res?.status === 201) {
        callback(res);
      }
    })
    .catch((error) => {
      callback(error.response);
    });
};


export const postRequest = (api, payloads, callback) => {
  axios
    .post(BASE_URL + api, payloads, {
      headers: {
        Authorization: getToken(), 
      },
    })
    .then((res) => {
      if (res?.status === 200 || res?.status === 201) {
        callback(res);
      }
    })
    .catch((error) => {
      callback(error.response);
    });
};


export const getRequest = (api, callback) => {
  axios
    .get(BASE_URL + api, {
      headers: {
        Authorization: getToken(), 
      },
    })
    .then((res) => {
      if (res?.status === 200) {
        callback(res);
      }
    })
    .catch((error) => {
      callback(error.response);
    });
};


export const putRequest = (api, payload, callback) => {
  axios
    .put(BASE_URL + api, payload, {
      headers: {
        Authorization:  getToken(),
      },
    })
    .then((res) => {
      if (res?.status === 201 || res?.status === 200) {
        callback(res);
      }
    })
    .catch((error) => {
      callback(error.response);
    });
};


export const deleteRequest = (api, callback) => {
  axios
    .delete(BASE_URL + api, {
      headers: {
        Authorization:  getToken(), 
      },
    })
    .then((res) => {
      if (res?.status === 201 || res?.status === 200) {
        callback(res);
      }
    })
    .catch((error) => {
      callback(error.response);
    });
};


