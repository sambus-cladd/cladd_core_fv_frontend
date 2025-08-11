import { useParams } from "react-router-dom";
import FormularioEnsayos from "./components/FormularioEnsayos";

export default function VerRutina(){
    const {rutinaId} = useParams();

    return(
        <FormularioEnsayos rutina = {rutinaId}/>
    );
}