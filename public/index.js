document.addEventListener("DOMContentLoaded", () => {
    const botonCambiarNombre = document.getElementById("cambiar-nombre-boton")
    const botonChatear = document.getElementById("chatear")
    const mensajeChat = document.getElementById("mensaje")
    const nuevoNombre = document.getElementById("nombre")

    botonCambiarNombre.addEventListener("click", () => {
        fetch(`${window.location.origin}/nombre`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre.value })
        })

        nuevoNombre.value = ""
    })

    botonChatear.addEventListener("click", () => {
        fetch(`${window.location.origin}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: mensajeChat.value })
        })

        mensajeChat.value = ""
    })

    document.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            fetch(`${window.location.origin}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mensaje: mensajeChat.value })
            })

            mensajeChat.value = ""
        }
    })

    setInterval(recibirChat, 1000)
})

async function recibirChat() {
    const cuadroChat = document.getElementById("chat")

    await fetch(`${window.location.origin}/chat`)
        .then(res => res.json())
        .then(data => {
            chat = ""
            data.forEach(e => {
                const tiempo = new Date(e.timestamp)
                chat += `<p><span class='horas-chat'>${tiempo.getHours().toString().padStart(2, "0")}:${tiempo.getMinutes().toString().padStart(2, "0")}:${tiempo.getSeconds().toString().padStart(2, "0")}</span> | <span class='nombre-chat'>${e.usuario}</span>: <span class='mensaje-chat'>${e.mensaje}</span></p>`
            });
            cuadroChat.innerHTML = chat
        })
    
    cuadroChat.scrollTop = cuadroChat.scrollHeight
}