export default {
    name: "dados",
    description: "Un comando para tirar unos dados",
    roles: ["user", "admin"],
    execute: async ({ args }) => {
        let max = parseInt(args[0]) || 6
        let numeroAleatorio = Math.floor(Math.random() * max) + 1

        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `Has sacado un ${numeroAleatorio}`
            }
        };
    }
};
