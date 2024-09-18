import axios from "axios";
import { BASE_URL } from "./ApiConstants";


const getToken = () => localStorage.getItem("token");

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
   
      window.location.href = "/";
    } 
    return Promise.reject(error);
  }
);


export const postRequestWithoutAuth = async (api, payloads, callback) => {
  await axios
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


export const postRequest =  async(api, payloads, callback) => {
   await axios
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


export const getRequest = async (api, callback) => {
 await axios
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


export const putRequest = async (api, payload, callback) => {
  await axios
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


export const patchRequest = async (api, payload, callback) => {
  await axios
    .patch(BASE_URL + api, payload, {
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



export const  deleteRequest = async (api, callback) => {
 await axios
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


