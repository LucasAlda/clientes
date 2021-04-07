import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Input, { SelectInput } from "../../../components/Input";
import { useForm } from "react-hook-form";
import UserSelect from "../../../components/UserSelect";

const ModalTicket = ({ modal, setModal, users: usersArray, handleSubmit: handleSubmitModal }) => {
  const { register, handleSubmit, errors, getValues, setValue } = useForm();
  const onSubmit = handleSubmit((data) => handleSubmitModal({ ...data, users }));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(
      JSON.parse(modal.data.DESTINO_ARRAY || "[]")
        .map((a) => usersArray.find((u) => u.sub === a))
        .map((a) => ({
          label: a.username,
          value: a.sub,
        }))
    );
  }, [modal.data.DESTINO_ARRAY, usersArray]);

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
        <UserSelect name="users" users={users} setUsers={setUsers} usersArray={usersArray} />
        <SelectInput
          value={1}
          register={register({ required: true })}
          errors={errors}
          errMsg="Estado Requerido"
          label="Estado"
          name="ESTADO"
          onChange={(e) => e.target.value === "0" && getValues().COMENTARIO === "" && setValue("COMENTARIO", "Hecho")}
          data={[
            { label: "Activo", value: 1 },
            { label: "Hecho", value: 0 },
            { label: "Anulado", value: -1 },
          ]}
        />

        <div className={`form-group${errors.COMENTARIO ? " error" : ""}`}>
          <label>Comentario</label>
          <textarea
            onKeyUp={(e) => {
              e.target.style.height = "1px";
              e.target.style.height = 25 + e.target.scrollHeight + "px";
            }}
            name="COMENTARIO"
            ref={register({ required: true })}
          ></textarea>
        </div>
        <Input type="checkbox" name="CAMBIAR_TITULO" label="Comentario como titulo" register={register} />
        <input type="submit" style={{ display: "none" }} />
      </form>
    </Modal>
  );
};

export default ModalTicket;
