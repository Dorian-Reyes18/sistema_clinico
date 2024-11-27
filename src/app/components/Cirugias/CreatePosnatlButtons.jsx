import { useRouter } from "next/navigation";

const CreatePosnatalButtons = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/cirugias/gestionarCirugiaPostnatal?mode=isCreateMode");
  };

  return (
    <button className="btn btn-azul" onClick={handleClick}>
      Nueva Cirugia
    </button>
  );
};

export default CreatePosnatalButtons;
