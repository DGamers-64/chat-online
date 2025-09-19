export function cls() {
    let nuevoChat = []
    let nuevoNombres = []
    let nuevoId = 0

    return { mostrar: false, mensajeSistema: {}, chat: nuevoChat, nombres: nuevoNombres, id: nuevoId }
}
