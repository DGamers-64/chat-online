export default {
    name: "desfijar",
    description: "Desfija un mensaje",
    roles: ["admin"],

    execute: async ({ args, chatActual }) => {
        const mensaje = chatActual.find(e => e.id === Number(args[0]));
        if (!mensaje) {
            return { mostrar: true, mensajeSistema: { mensaje: `No se encontró el mensaje con id ${args[0]}` } };
        }
        mensaje.fijado = false;

        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `El mensaje ${mensaje.id} ha sido desfijado`
            }
        };
    }
};
