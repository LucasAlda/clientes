import React, { useState } from "react";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import { useForm } from "react-hook-form";
import UserSelect from "../../../components/UserSelect";

const ModalTicket = ({ modal, setModal, users: usersArray, handleSubmit: handleSubmitModal }) => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = handleSubmit((data) => handleSubmitModal({ ...data, users }));
  const [users, setUsers] = useState([]);

  return (
    <Modal
      show={modal.show}
      setModal={setModal}
      title={modal.action === "ADD" ? "Agregar Ticket" : `Editar Cuenta`}
      handleSubmit={onSubmit}
      size="md"
    >
      <form onSubmit={onSubmit}>
        <Input
          autoFocus
          type="date"
          register={register({ required: true })}
          errors={errors}
          errMsg="El vencimiento es obligatorio!"
          label="Vencimiento"
          name="VENCIMIENTO"
          value={modal.data.VENCIMIENTO}
        />
        <Input
          register={register({ required: true })}
          errors={errors}
          errMsg="El Comitente es obligatorio!"
          name="COMITENTE"
          value={modal.data.comitenteId}
          label="Comitente"
        />
        <UserSelect name="users" users={users} setUsers={setUsers} usersArray={usersArray} value={[]} />

        <div className={`form-group${errors.TITULO ? " error" : ""}`}>
          <label>Titulo</label>
          <textarea
            onKeyUp={(e) => {
              e.target.style.height = "1px";
              e.target.style.height = 25 + e.target.scrollHeight + "px";
            }}
            name="TITULO"
            ref={register({ required: true })}
          ></textarea>
        </div>
        <input type="submit" style={{ display: "none" }} />
      </form>
    </Modal>
  );
};

export default ModalTicket;
