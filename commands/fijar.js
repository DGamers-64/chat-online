export async function fijar(id, chatActual) {
    const mensaje = chatActual.find(e => e.id === Number(id));
    if (!mensaje) {
        return { mostrar: true, mensajeSistema: { mensaje: `No se encontró el mensaje con id ${id}` } };
    }
    mensaje.fijado = true;

    return { mostrar: true, mensajeSistema: { mensaje: `El mensaje ${mensaje.id} ha sido fijado` } };
}
