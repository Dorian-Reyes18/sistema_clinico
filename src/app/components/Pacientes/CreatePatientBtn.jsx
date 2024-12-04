import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spin } from "antd";

const CreatePatientButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push("/pacientes/crearPaciente?mode=isCreateMode");
  };

  return (
    <div>
      <button className="btn btn-azul" onClick={handleClick}>
        Crear Paciente
      </button>
      {isLoading && (
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default CreatePatientButton;
