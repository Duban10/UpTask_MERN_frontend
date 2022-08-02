import {useState, useEffect, createContext} from 'react'
//import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'


const AuthContext = createContext()

// De donde vienen los datos
const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    //const navigate = useNavigate()

    useEffect(() => {
    
        const autenticarUsuarios = async () => {
            const token = localStorage.getItem('token')
            //console.log(token);
            if(!token){
                setCargando(false)
                return
            }
            //console.log('SI HAY TOKEN');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                //console.log(data);
                setAuth(data);
                //navigate('/proyectos') // Si inicio sesion y no la ha cerrado no podra ir a login, siempre estara en /proyectos
            } catch (error) {
                setAuth({})
            } finally{
                setCargando(false)
            }
        }

        autenticarUsuarios()
    }, []);

    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext





