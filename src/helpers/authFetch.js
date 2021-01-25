import axios from "axios";

const authFetch = (route, { method = "GET", headers = {}, json = false, body = {}, auth = true } = {}) => {
  return new Promise((resolve, reject) => {
    axios({
      url: "http://localhost:4000/api" + route,
      method: method,
      headers: {
        ...headers,
      },
      data: body,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default authFetch;
