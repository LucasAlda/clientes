import React, { useState } from "react";
import "../../assets/styles/Template.css";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import Button from "../../components/Button";

const Login = ({ history, setAuth, setUser }) => {
  const { addToast } = useToasts();
  const [error, setError] = useState(false);

  const handleLogin = () =>
    authFetch("/user/login", {
      auth: false,
      method: "POST",
      body: { username: "lucas@aldazabal.com.ar", password: "Lucas1890" },
    })
      .then((data) => {
        console.log(data);
        window.localStorage.setItem("token", data.accessToken);
        setAuth(data.accessToken);
        setUser({
          sub: data.ID_USUARIO,
          username: data.USUARIO,
          abv: data.ABREVIATURA,
          mail: data.MAIL,
          tipo: data.TIPO,
          comitentes: data.COMITENTES,
        });
        console.log(data, data.accessToken);
        history.push("/");
      })
      .catch((err) => {
        if (err.response.status === 500) {
          addToast("Error al verificar con el servidor!", { appearance: "error" });
        }
        if (err.response.status === 400) {
          setError(true);
        }
      });

  return (
    <main className="template">
      <h1>Login</h1>
      <h2>
        <Button onClick={handleLogin}>Login</Button>
      </h2>
    </main>
  );
};

export default Login;
