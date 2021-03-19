import React from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import bancosJson from "../../assets/static/bancos.json";

const ModalCuentas = ({ modal, setModal, handleSubmit: handleSubmitModal }) => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const onSubmit = handleSubmit((data) => handleSubmitModal(data));

  const handleCBU = (e) => {
    const data = e.target.value;
    const banco = bancosJson[data.substr(0, 3)];
    console.log(banco);
    if (banco) setValue("Banco", banco);
  };

  function validarCBU(cbu) {
    const validarLargoCBU = (cbu) => {
      if (cbu.length !== 22) return false;
      return true;
    };

    const validarCodigoBanco = (codigo) => {
      if (codigo.length !== 8) return false;
      const banco = codigo.substr(0, 3);
      const sucursal = codigo.substr(3, 4);
      const digitoVerificador = codigo[7];

      const suma =
        banco[0] * 7 +
        banco[1] * 1 +
        banco[2] * 3 +
        sucursal[0] * 9 +
        sucursal[1] * 7 +
        sucursal[2] * 1 +
        sucursal[3] * 3;
      const diferencia = 10 - (suma % 10);

      return diferencia === (parseInt(digitoVerificador) !== 0 ? parseInt(digitoVerificador) : 10);
    };

    const validarCuenta = (cuenta) => {
      if (cuenta.length !== 14) return false;
      const digitoVerificador = cuenta[13];
      const suma =
        cuenta[0] * 3 +
        cuenta[1] * 9 +
        cuenta[2] * 7 +
        cuenta[3] * 1 +
        cuenta[4] * 3 +
        cuenta[5] * 9 +
        cuenta[6] * 7 +
        cuenta[7] * 1 +
        cuenta[8] * 3 +
        cuenta[9] * 9 +
        cuenta[10] * 7 +
        cuenta[11] * 1 +
        cuenta[12] * 3;
      const diferencia = 10 - (suma % 10);
      console.log("cuenta:", diferencia === parseInt(digitoVerificador), suma, diferencia, digitoVerificador);
      return diferencia === (parseInt(digitoVerificador) !== 0 ? parseInt(digitoVerificador) : 10);
    };
    return validarLargoCBU(cbu) && validarCodigoBanco(cbu.substr(0, 8)) && validarCuenta(cbu.substr(8, 14));
  }

  function validarCuit(cuit) {
    cuit = cuit.toString();
    if (cuit.length !== 11) {
      return false;
    }

    let acumulado = 0;
    let digitos = cuit.split("");
    let digito = digitos.pop();

    for (let i = 0; i < digitos.length; i++) {
      acumulado += digitos[9 - i] * (2 + (i % 6));
    }

    let verif = 11 - (acumulado % 11);
    if (verif === 11) {
      verif = 0;
    } else if (verif === 10) {
      verif = 9;
    }

    return parseInt(digito) === verif;
  }

  return (
    <Modal
      show={modal.show}
      setModal={setModal}
      title={modal.action === "ADD" ? "Agregar Cuenta" : `Editar Cuenta`}
      handleSubmit={onSubmit}
    >
      <form onSubmit={onSubmit}>
        <Input
          autoFocus
          register={register({ required: true, validate: { valid: (value) => validarCuit(value) } })}
          errors={errors}
          errMsg="El CUIT es Invalido!"
          name="Cuit"
          value={modal.data.Cuit}
          label="CUIT"
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="Escriba una Moneda!"
          name="Moneda"
          value={modal.data.Moneda}
          label="Moneda"
        />
        <Input
          register={register({ required: true, validate: { valid: (value) => validarCBU(value) } })}
          onChange={handleCBU}
          errors={errors}
          errMsg="El CBU es invalido!"
          name="CBU"
          value={modal.data.CBU}
          label="CBU"
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="El Banco es requerido!"
          name="Banco"
          value={modal.data.Banco}
          label="Banco"
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="El Tipo Cuenta es requerido!"
          name="TipoCuenta"
          value={modal.data.TipoCuenta}
          label="Tipo Cuenta"
        />
        <input type="submit" style={{ display: "none" }} />
      </form>
    </Modal>
  );
};

export default ModalCuentas;
