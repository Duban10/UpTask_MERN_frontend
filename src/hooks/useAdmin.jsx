import useProyectos from "./useProyectos";
import useAuth from "./useAuth"

const useAdmin = () => {
    const { proyecto } = useProyectos()
    const { auth } = useAuth();

    // SI EL QUE ESTA LOGUEADO ES IGUAL AL QUE CREO EL PROYECTO VA A TENER PERMISOS DE ADMIN
    return proyecto.creador === auth._id
}

export default useAdmin