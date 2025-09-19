export function dados(numeroMax) {
    let max = parseInt(numeroMax) || 6
    let numeroAleatorio = Math.floor(Math.random() * max) + 1
    return { mostrar: true, mensajeSistema: { mensaje: `Has sacado un ${numeroAleatorio}` } }
}
