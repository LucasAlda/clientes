import axios from "axios";

const authFetch = (
  route,
  { method = "GET", responseType, headers = {}, json = false, body = {}, auth = true } = {}
) => {
  return new Promise((resolve, reject) => {
    axios({
      // url: "http://172.20.2.69:4000/api" + route,
      responseType,
      url: process.env.REACT_APP_API + route,
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
