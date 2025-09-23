let ultimoId = -1
let tieneMensajesNuevos = false;
let notificacionesActivadas = Notification.permission === "granted";
let notificacionesUsuario = notificacionesActivadas;

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        document.title = "Chat";
        tieneMensajesNuevos = false;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const botonCambiarNombre = document.getElementById("cambiar-nombre-boton")
    const botonChatear = document.getElementById("chatear")
    const mensajeChat = document.getElementById("mensaje")
    const nuevoNombre = document.getElementById("nombre")
    const botonNotificaciones = document.getElementById("notificaciones")
    const insertarImagen = document.getElementById("insertar-imagen")

    botonNotificaciones.innerHTML = notificacionesUsuario ? "Notificaciones activadas" : "Notificaciones desactivadas";

    botonCambiarNombre.addEventListener("click", () => {
        cambiarNombre(nuevoNombre)
    })

    nuevoNombre.addEventListener("keydown", (e) => {
        if (e.key == "Enter") cambiarNombre(nuevoNombre)
    })

    insertarImagen.addEventListener("click", () => {
        chatear(`<img src="${mensajeChat}">`)
    })

    botonChatear.addEventListener("click", () => {
        chatear(mensajeChat)
    })

    mensajeChat.addEventListener("keydown", (e) => {
        if (e.key == "Enter") chatear(mensajeChat)
    })

    botonNotificaciones.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!("Notification" in window)) {
            alert("Este navegador no soporta notificaciones.");
            return;
        }

        if (Notification.permission !== "granted") {
            const permiso = await Notification.requestPermission();
            if (permiso !== "granted") {
                alert("No se pudieron activar las notificaciones.");
                return;
            }
        }

        notificacionesUsuario = !notificacionesUsuario;
        botonNotificaciones.innerHTML = notificacionesUsuario ? "Notificaciones activadas" : "Notificaciones desactivadas";
    });

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

    await fetch(`${window.location.origin}/chat?id=${ultimoId + 1}`)
        .then(res => res.json())
        .then(data => {
            let chat = cuadroChat.innerHTML

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

                ultimoId = e.id

                if (document.visibilityState !== "visible" && !tieneMensajesNuevos) {
                    document.title = "Chat ●";
                    tieneMensajesNuevos = true;

                    if (notificacionesUsuario && Notification.permission === "granted") {
                        new Notification(e.usuario, { body: e.mensaje });
                    }
                }
            })
            cuadroChat.innerHTML = chat
        })
        .catch((e) => {
            cuadroChat.innerHTML = "<h1>Chat cerrado</h1>"
        })

    if (estabaAbajo) {
        cuadroChat.scrollTop = cuadroChat.scrollHeight
    }
}

