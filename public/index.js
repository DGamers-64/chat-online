document.addEventListener("DOMContentLoaded", () => {
    const botonCambiarNombre = document.getElementById("cambiar-nombre-boton")
    const botonChatear = document.getElementById("chatear")
    const mensajeChat = document.getElementById("mensaje")
    const nuevoNombre = document.getElementById("nombre")
    const insertarImagen = document.getElementById("insertar-imagen")

    insertarImagen.addEventListener("click", () => {
        fetch(`${window.location.origin}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: `<img src="${mensajeChat.value}">` })
        })
        mensajeChat.value = ""
    })

    botonCambiarNombre.addEventListener("click", () => {
        cambiarNombre(nuevoNombre)
    })

    nuevoNombre.addEventListener("keydown", (e) => {
        if (e.key == "Enter") cambiarNombre(nuevoNombre)
    })

    botonChatear.addEventListener("click", () => {
        chatear(mensajeChat)
    })

    mensajeChat.addEventListener("keydown", (e) => {
        if (e.key == "Enter") chatear(mensajeChat)
    })

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("respuesta-chat")) {
            e.preventDefault()
            const id = e.target.getAttribute("href").substring(1) // ej: msg-7
            const mensaje = document.getElementById(id)
            const chat = document.getElementById("chat")

            if (mensaje) {
                chat.scrollTop = mensaje.offsetTop - chat.offsetTop

                // quitar highlight de todos
                document.querySelectorAll(".highlight").forEach(m => m.classList.remove("highlight"))

                // añadir highlight al actual
                mensaje.classList.add("highlight")
            }
        }
    })

    setInterval(recibirChat, 1000)
})

function cambiarNombre(nuevoNombre) {
    fetch(`${window.location.origin}/nombre`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre.value })
    })
    nuevoNombre.value = ""
}

function chatear(mensajeChat) {
    fetch(`${window.location.origin}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: mensajeChat.value })
    })
    mensajeChat.value = ""
}

async function recibirChat() {
    const cuadroChat = document.getElementById("chat")
    const estabaAbajo = cuadroChat.scrollTop + cuadroChat.clientHeight >= cuadroChat.scrollHeight - 5

    await fetch(`${window.location.origin}/chat`)
        .then(res => res.json())
        .then(data => {
            let chat = ""
            data.forEach(e => {
                const tiempo = new Date(e.timestamp)
                
                let respuesta = false
                let mensajeRespondido

                if (e.mensaje.startsWith("@")) {
                    let id = e.mensaje.split("@")[1]
                    mensajeRespondido = data.find((m) => m.id == id)
                    respuesta = true
                }

                if (!respuesta) {
                    chat += `<p id="msg-${e.id}">
                                <span class='id-chat'>#${e.id.toString().padStart(4, "0")}</span> 
                                <span class='horas-chat'>
                                    ${tiempo.getHours().toString().padStart(2, "0")}:${tiempo.getMinutes().toString().padStart(2, "0")}:${tiempo.getSeconds().toString().padStart(2, "0")}
                                </span> 
                                | <span class='nombre-chat'>${e.usuario}</span>: 
                                <span class='mensaje-chat'>${e.mensaje}</span>
                             </p>`
                } else {
                    chat += `<a href="#msg-${mensajeRespondido.id}" class="respuesta-chat">
                                &gt; ${mensajeRespondido.usuario}: ${mensajeRespondido.mensaje}
                             </a>
                             <p class="respuesta-chat" id="msg-${e.id}">
                                <span class='id-chat'>#${e.id.toString().padStart(4, "0")}</span> 
                                <span class='horas-chat'>
                                    ${tiempo.getHours().toString().padStart(2, "0")}:${tiempo.getMinutes().toString().padStart(2, "0")}:${tiempo.getSeconds().toString().padStart(2, "0")}
                                </span> 
                                | <span class='nombre-chat'>${e.usuario}</span>: 
                                <span class='mensaje-chat'>${e.mensaje.split("@")[2]}</span>
                             </p>`
                }
            })
            cuadroChat.innerHTML = chat
        })

    if (estabaAbajo) {
        cuadroChat.scrollTop = cuadroChat.scrollHeight
    }
}

