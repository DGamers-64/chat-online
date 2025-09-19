export function ayuda() {
    return {
        mostrar: true,
        mensajeSistema: {
            mensaje: `<div style='border: 1px solid black; width: 80%; display: flex; padding: 1rem; flex-direction: column;'>
                <h2><b>Bienvenido a chat online en nodejs</b></h2>
                <h3>Cosas básicas</h3>
                <ul style='padding: 1rem;'>
                    <li>Para mandar una imagen tienes que poner el enlace en el cuadro de mensaje y darle a enviar imagen</li>
                    <li>Puedes insertar HTML</li>
                    <li>Para responder un mensaje escribir al principio de la respuesta @id@, el id es el número de la izquierda no tenéis porque poner los 0</li>
                </ul>
                <h3>Comandos</h3>
                <ul style='padding: 1rem;'>
                    <li>/ayuda: Muestra esta ayuda</li>
                    <li>/cls: Limpia el chat y los nombres</li>
                    <li>/dados {numero}: Tira un dado de tantas caras como especifiques</li>
                </ul>
            </div>`
        }
    }
}
