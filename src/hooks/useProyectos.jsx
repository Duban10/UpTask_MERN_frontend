import { useContext } from "react";
import ProyectosContex from "../context/ProyectosProvider";

const useProyectos = () => {
    return useContext(ProyectosContex)
}

export default useProyectos

