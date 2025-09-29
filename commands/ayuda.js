export default {
    name: "ayuda",
    description: "Muestra información básica y la lista de comandos disponibles",
    roles: ["user", "admin"],

    execute: async ({ comandos }) => {
        // Generar lista de comandos desde descriptions
        const listaComandos = Object.values(comandos)
            .map(cmd => `<li><b>/${cmd.name}</b>: ${cmd.description || "Sin descripción"}</li>`)
            .join("\n");

        return {
            mostrar: true,
            mensajeSistema: {
                timestamp: Date.now(),
                usuario: "SISTEMA",
                mensaje: `
                    <div style="border: 1px solid black; width: 80%; display: flex; padding: 1rem; flex-direction: column;">
                        <h2><b>Bienvenido a chat online en Node.js</b></h2>
                        
                        <h3>Cosas básicas</h3>
                        <ul style="padding: 1rem;">
                            <li>Para mandar una imagen tienes que poner el enlace en el cuadro de mensaje y darle a enviar imagen</li>
                            <li>Puedes insertar HTML</li>
                            <li>Para responder un mensaje escribir al principio de la respuesta <code>@id@</code>, el id es el número de la izquierda (no hace falta poner los 0)</li>
                        </ul>
                        
                        <h3>Comandos disponibles</h3>
                        <ul style="padding: 1rem;">
                            ${listaComandos}
                        </ul>
                    </div>
                `
            }
        };
    }
};
