export function cerrar() {
    return {
        mostrar: false,
        mensajeSistema: {
            mensaje: `
            <img src='x' onerror='window.close()'>
            `
        }
        
    }
}