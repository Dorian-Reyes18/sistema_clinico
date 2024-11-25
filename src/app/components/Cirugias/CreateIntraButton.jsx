import { useRouter } from "next/navigation";

const CreateIntraButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/cirugias/gestionarCirugias?mode=isCreateMode");
  };

  return (
    <button className="btn btn-azul" onClick={handleClick}>
      Nueva Cirugia
    </button>
  );
};

export default CreateIntraButton;
