import React from "react";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";

const ModalCuentas = ({ modal, setModal, handleSubmit: handleSubmitModal }) => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = handleSubmit((data) => handleSubmitModal(data));

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
          register={register({ required: true, minLength: 11, maxLength: 11 })}
          errors={errors}
          errMsg="El cuit debe tener 11 caracteres!"
          name="CUIT"
          value={modal.data.CUIT}
          label="CUIT"
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="Escriba una Moneda!"
          name="MONEDA"
          value={modal.data.MONEDA}
          label="Moneda"
        />
        <Input
          register={register({ required: true, minLength: 22, maxLength: 22 })}
          errors={errors}
          errMsg="El CBU debe tener 22 caracteres!"
          name="CBU"
          value={modal.data.CBU}
          label="CBU"
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="El Banco es requerido!"
          name="BANCO"
          value={modal.data.BANCO}
          label="Banco"
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="El Tipo Cuenta es requerido!"
          name="TIPO_CUENTA"
          value={modal.data.TIPO_CUENTA}
          label="Tipo Cuenta"
        />
        <input type="submit" style={{ display: "none" }} />
      </form>
    </Modal>
  );
};

export default ModalCuentas;
