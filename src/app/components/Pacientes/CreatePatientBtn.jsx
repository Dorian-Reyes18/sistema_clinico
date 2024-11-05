import { useRouter } from "next/navigation";

const CreatePatientButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/pacientes/crearPaciente?mode=isCreateMode"); 
  };

  return (
    <button className="btn btn-azul" onClick={handleClick}>
      Crear Paciente
    </button>
  );
};

export default CreatePatientButton;
