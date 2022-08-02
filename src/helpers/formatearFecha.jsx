export const formatearFecha = fecha => {
    //console.log(fecha.split('T')[0].split('-'));

    const nuevaFecha = new Date(fecha.split('T')[0].split('-'))

    const opciones ={
        weekday: 'long', //aparezaca el dia completo
        year:'numeric', // año
        month: 'long', // mes completo
        day: 'numeric' // numero  y nombre del dia
    }

    return nuevaFecha.toLocaleDateString('es-ES', opciones)
}