import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"


const FormularioProyecto = () => {

    const [id, setId ] = useState(null)
    const [nombre, setNombre ] = useState('')
    const [descripcion, setDescripcion ] = useState('')
    const [fechaEntrega, setFechaEntrega ] = useState('')
    const [cliente, setCliente ] = useState('')

    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    const params = useParams()
    //console.log(params);

    useEffect(() => {
       //console.log(params);

       // se condiciona proyecto.nombre porque el useEffect se ejecuta mas rapido que la consulta a tener el proyecto y asi poder obtener la fecha de entrega para editarla
    //    if(params.id && proyecto.nombre){
    //     //console.log(`Editando id numero ${params.id}`);
    //     setNombre(proyecto.nombre)
    //     setDescripcion(proyecto.descripcion)
    //     setFechaEntrega(proyecto.fechaEntrega.split('T')[0])
    //     setCliente(proyecto.cliente)
    if(params.id){
        //console.log(`Editando id numero ${params.id}`);
        setId(proyecto._id)
        setNombre(proyecto.nombre)
        setDescripcion(proyecto.descripcion)
        setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
        setCliente(proyecto.cliente)

       }
    //    else {
    //     console.log('Nuevo proyecto');
    //    }
    }, [params]);

    const handleSubmit = async e => {
        e.preventDefault();

        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }
        // Pasar los datos hacia el provider -  await para que se ejecute correctamente y luego reiniciamos las variables
        await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente})
        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')        
    }

    const { msg } = alerta

  return (
    <form action="" className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow" onSubmit={handleSubmit}>

        { msg && <Alerta alerta={alerta} />}

        <div className="mb-5 ">
            <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm"> Nombre Proyecto</label>
            <input type="text" name="" id="nombre" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md " placeholder="Nombre del Proyecto"
                value={nombre} onChange={e => setNombre(e.target.value)}
            />
        </div>
        <div className="mb-5 ">
            <label htmlFor="descripcion" className="text-gray-700 uppercase font-bold text-sm">Descipci??n</label>
            <textarea name="" id="descripcion" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md " placeholder="Descripci??n del Proyecto"
                value={descripcion} onChange={e => setDescripcion(e.target.value)}
            />
        </div>
        <div className="mb-5 ">
            <label htmlFor="fecha-entrega" className="text-gray-700 uppercase font-bold text-sm">Fecha de Entrega</label>
            <input type="date" name="" id="fecha-entrega" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md "
                value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)}
            />
        </div>
        <div className="mb-5 ">
            <label htmlFor="cliente" className="text-gray-700 uppercase font-bold text-sm"> Nombre Cliente</label>
            <input type="text" name="" id="cliente" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md " placeholder="Nombre del Cliente"
                value={cliente} onChange={e => setCliente(e.target.value)}
            />
        </div>
        <input type="submit" value={ id ? 'Actualizar Proyecto' : 'Crear Proyecto' } 
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700" />

    </form>
  )
}

export default FormularioProyecto