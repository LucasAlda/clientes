import React, { useEffect, useState } from "react";
import CustomModal from "../../components/Modal";
import Button from "../../components/Button";
import Input, { SelectInput } from "../../components/Input";
import Files from "react-butterfiles";
import { useForm } from "react-hook-form";

const Modal = ({ title, modal, setModal, handleSubmit: handleSubmitModal }) => {
  const [uploadErrors, setUploadErrors] = useState([]);
  const [file, setFile] = useState();
  const { handleSubmit, register, errors } = useForm();
  const [uploadRequired, setUploadRequired] = useState(false);
  const [tipoDoc, setTipoDoc] = useState(1);

  useEffect(() => {
    if (modal.show) {
      setFile();
      setUploadErrors([]);
      setUploadRequired(false);
    }
  }, [modal.show]);

  const onSubmit = handleSubmit((data) => {
    if (!file) {
      setUploadRequired(true);
    } else {
      handleSubmitModal(data, file);
    }
  });

  const handleSuccess = (uploadedFile) => {
    setFile(uploadedFile[0]);
    setUploadRequired(false);
  };

  const handleErrors = (file) => {
    setUploadErrors(file);
  };

  const tiposDoc = {
    1: "Apertura",
    2: "DNI y Constancias AFIP",
    3: "DDJJs AFIP",
    4: "Estatuto",
    5: "Balance",
    6: "Origen de Fondos",
    7: "Documentos Varios",
    8: "Transferencia de titulos",
  };

  return (
    <CustomModal show={modal.show} title="Subir Documento" setModal={setModal} handleSubmit={onSubmit}>
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
                    minHeight: 120,
                    position: "relative",
                    border: `2px ${uploadRequired ? "#e60000" : "lightgray"} dashed`,
                  },
                })}
              >
                <ol>
                  {uploadErrors.map((error) => (
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
                  {file && <li>{file.name}</li>}
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
              {uploadRequired && <span style={{ color: "#e60000" }}>Archivo Requerido</span>}
              <form onSubmit={onSubmit} style={{ marginTop: 20 }}>
                <SelectInput
                  label="Tipo Documento"
                  name="TIPO_DOC"
                  register={register({ required: true })}
                  errors={errors}
                  errMsg="Tipo de Documento Requerido"
                  value={tipoDoc}
                  onChange={(e) => setTipoDoc(e.target.value || "none")}
                  data={Object.keys(tiposDoc).map((a) => ({ label: tiposDoc[a], value: a }))}
                />
                <Input
                  register={register({ required: true })}
                  errors={errors}
                  errMsg="Fecha Requerida"
                  type="date"
                  name="FECHA"
                  label="Fecha Documento"
                />
                {"3|5".includes(tipoDoc) && (
                  <Input
                    register={register({ required: true })}
                    errors={errors}
                    errMsg="Vencimiento Requerido"
                    type="date"
                    name="VENCIMIENTO"
                    label="Vencimiento"
                  />
                )}
                {"6|7".includes(tipoDoc) && <Input register={register} name="DESCRIPCION" label="Descripcion" />}
                {"3|5".includes(tipoDoc) && (
                  <SelectInput
                    register={register({ required: true })}
                    errors={errors}
                    errMsg="Periodo Requerido"
                    name="PERIODO"
                    label="Periodo"
                    data={[
                      { label: "2021", value: "2021" },
                      { label: "2020", value: "2020" },
                      { label: "2019", value: "2019" },
                      { label: "2018", value: "2018" },
                      { label: "2017", value: "2017" },
                      { label: "2016", value: "2016" },
                      { label: "2015", value: "2015" },
                      { label: "2014", value: "2014" },
                      { label: "2013", value: "2013" },
                      { label: "2012", value: "2012" },
                      { label: "2011", value: "2011" },
                    ]}
                  />
                )}
              </form>
            </div>
          );
        }}
      </Files>
    </CustomModal>
  );
};

export default Modal;
