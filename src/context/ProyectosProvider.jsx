import { useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth';

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)


    const navigate = useNavigate()
    const { auth } = useAuth()


    useEffect( () => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                // Sino hay token return para que no ejecute un proyecto
                if (!token) return

                const config = {
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios('/proyectos', config)
                //console.log(data);
                setProyectos(data)
            } catch (error) {
                console.log(error);
            }
        }

        obtenerProyectos()
    }, [auth])

    useEffect(() => {
       socket = io(import.meta.env.VITE_BACKEND_URL)
       //socket = io('http://localhost:4000')
    }, []);

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    const submitProyecto = async proyecto => {
        //console.log(proyecto);
        if(proyecto.id){
           await editarProyecto(proyecto)
        }else{
           await nuevoProyecto(proyecto)
        }

    }

    const editarProyecto = async (proyecto) =>{
        //console.log('editando...');
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            //console.log(data);
    
            // SINCRONIZAR EL STATE ----> devuelve los proyectos con el proyecto que se esta actualizando ya acualizado
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            //console.log(proyectosActualizados);
            setProyectos(proyectosActualizados)
    
            // MOSTRAR LA ALERTA
            setAlerta({
                msg: 'Proyecto actualizado correctamente',
                error: false
            })

            // REDIRECCIONAR
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
            

        } catch (error) {
            console.log(error);
        }

    }

    const nuevoProyecto = async (proyecto) =>{
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
            //console.log(data)
            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto creado correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async id => {
        //console.log(id);
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            //console.log(data);
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id) => {
        //console.log('eliminado', id)
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            //console.log(data);

            // SINCRONIZAR EL STATE
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            //console.log(proyectosAlmacenados);
            setProyectos(proyectosActualizados);


            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error);
        }
    }

    const hanledModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {
        // console.log(tarea)

        if(tarea.id){
           await editarTarea(tarea)
        }else{
           await crearTarea(tarea)
        }
              
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/tareas', tarea, config)
            //console.log(data);

            // AGREGA LA TAREA AL STATE -- LO HACE SOCKET io
           
            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET IO
            socket.emit('nueva tarea', data)


        } catch (error) {
            console.log(error);
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            // data devuelve la tarea actualizada
            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            //console.log(data);
            
            setAlerta({})
            setModalFormularioTarea(false)

            // socket
            
            socket.emit('actualizar tarea', data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = tarea => {
        //console.log(tarea)
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        //console.log(tarea);

        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            // data devuelve la tarea actualizada
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            //console.log(data);           
            setAlerta({
                msg: data.msg,
                error: false
            })

               
            setModalEliminarTarea(false)
            
            // SOCKET io
            socket.emit('eliminar tarea', tarea)
            
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async email => {
        //console.log(email);
        setCargando(true) // por si tenemos 2 MILLONES DE COLABORADORES
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)

            //console.log(data);
            setColaborador(data)
            setAlerta({})

        } catch (error) {
           // console.log(error.response)
           setAlerta({
                msg: error.response.data.msg,
                error: true
           })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        //console.log(email);
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            //console.log(data);
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 3000);
            
            
        } catch (error) {
            //console.log(error.response);
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
       
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        //console.log(colaborador);

        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        //console.log(colaborador)
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            
            setTimeout(() => {
                setAlerta({})
            }, 3000);

        } catch (error) {
            console.log(error.response);
        }
    }

    const completarTarea = async id => {
        //console.log(id);
        try {
            const token = localStorage.getItem('token')
            // Sino hay token return para que no ejecute un proyecto
            if (!token) return

            const config = {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            //console.log(data);
            

            setTarea({})
            setAlerta({})


            // socket io
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // SOCKET io

    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)  
    }

    const actualizarTareaProyecto = (tarea) => {        
            // TODO: Actualizar el DOM
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState)
            setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})

    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto, 
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                hanledModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}        
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext
