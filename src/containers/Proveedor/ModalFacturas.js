import React, { useState } from "react";
import CustomModal from "../../components/Modal";
import Files from "react-butterfiles";
import Button from "../../components/Button";

const Modal = ({ title, modal, setModal, handleSubmit: handleSubmitModal }) => {
  const handleSuccess = (file) => {
    handleSubmitModal(file);
  };
  const handleErrors = (file) => {
    setErrors(file);
  };

  const [errors, setErrors] = useState([]);

  return (
    <CustomModal show={modal.show} title={title} setModal={setModal}>
      <Files
        multiple={false}
        maxSize="10mb"
        accept={["application/pdf", "image/jpg", "image/jpeg"]}
        onSuccess={handleSuccess}
        onError={handleErrors}
      >
        {({ browseFiles, getDropZoneProps }) => {
          return (
            <div>
              <div
                {...getDropZoneProps({
                  style: {
                    width: "100%",
                    minHeight: 200,
                    border: "2px lightgray dashed",
                  },
                })}
              >
                <ol>
                  {errors.map((error) => (
                    <li key={error.id}>
                      {error.file ? (
                        <span>
                          {error.file.name} - {error.type}
                        </span>
                      ) : (
                        error.type
                      )}
                    </li>
                  ))}
                </ol>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  Arrastre aquí su archivo.
                  <Button size="xs" color="secondary" onClick={browseFiles}>
                    Abrir Archivos
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      </Files>
    </CustomModal>
  );
};

export default Modal;
