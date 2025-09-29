export default {
    name: "echo",
    roles: ["user", "admin"],
    execute: (args) => {
        return {
            mostrar: true,
            mensajeSistema: {
                mensaje: `<h1>echoooo</h1>`
            }
        }
    }
};
