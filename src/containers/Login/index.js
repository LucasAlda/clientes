import React, { useState } from "react";
import "../../assets/styles/Login.css";
import authFetch from "../../helpers/authFetch";
import { useToasts } from "react-toast-notifications";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";

const Login = ({ history, setAuth, setUser }) => {
  const { register, handleSubmit, errors } = useForm();
  const { addToast } = useToasts();
  const [error, setError] = useState(false);

  const onSubmit = handleSubmit((data) => handleLogin(data));

  const handleLogin = (data) =>
    authFetch("/user/login", {
      auth: false,
      method: "POST",
      body: data,
    })
      .then((data) => {
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
    <main className="login">
      <Card>
        <img alt="Logo Aldazabal & Cia." src="https://exe.aldazabal.com.ar/clientes/img/logo/logoNuevo.svg" />
        <form onSubmit={onSubmit}>
          <h2>Iniciar Sesión</h2>
          <Input
            label="Usuario"
            name="username"
            register={register({ required: true })}
            errors={errors}
            errMsg="El usuario es requerido!"
          />
          <Input
            type="password"
            label="Contraseña"
            name="password"
            register={register({ required: true })}
            errors={errors}
            errMsg="La contraseña es requerida!"
          />
          <Button type="submit">Entrar</Button>
          <div className="errors-div">{error && "Usuario y/o contraseña incorrectos!"}</div>
        </form>
      </Card>
    </main>
  );
};

export default Login;
