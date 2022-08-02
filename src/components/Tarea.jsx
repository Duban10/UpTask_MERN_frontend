import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"


// ESTE PROPS VIENE DE Proyecto.jsx
const Tarea = ({tarea}) => {

  const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea}    = useProyectos()
  const admin  = useAdmin();
  //console.log(admin)

    const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div className="flex flex-col items-start">
            <div className="mb-2 text-xl">{nombre}</div>
            <div className="mb-2 text-sm text-gray-500 uppercase">{descripcion}</div>
            <div className="mb-2 text-sm">{ formatearFecha(fechaEntrega) }</div>
            <div className="mb-2 text-gray-600">Prioridad: {prioridad}</div>
            { estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white ">Completada por: {tarea.completado.nombre}</p>}
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          {admin && (
            <button className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => handleModalEditarTarea(tarea)}>Editar</button>
          )}
          
          {/* {estado ? (
              <button className="bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => completarTarea(_id)}>Completa</button>
            ): ( 
              <button className="bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => completarTarea(_id)}>Incompleta</button>
            )} */}

            
            <button className={` ${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`} onClick={() => completarTarea(_id)}>
              {estado ? 'Completa' : 'Incompleta'}
            </button>

          {admin && (  
            <button className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" onClick={() => handleModalEliminarTarea(tarea)}>Eliminar</button>
          )}
        </div>
    </div>
  )
}

export default Tarea