let ultimoId = -1
let tieneMensajesNuevos = false;
let historialChat = [];

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        document.title = "Chat";
        tieneMensajesNuevos = false;
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const botonCambiarNombre = document.getElementById("cambiar-nombre-boton")
    const botonChatear = document.getElementById("chatear")
    const mensajeChat = document.getElementById("mensaje")
    const nuevoNombre = document.getElementById("nombre")
    const insertarImagen = document.getElementById("insertar-imagen")
    const contenedorSalas = document.getElementById("salas")
    const contenedorHora = document.getElementById("hora")
    const fijadosContainer = document.getElementById("fijados-container")
    const botonFijados = document.getElementById("fijados")

    await fetch(`${window.location.origin}/nombre`)
        .then(res => res.json())
        .then(data => document.getElementById("nombre-actual").textContent = data[0])

    actualizarHora(contenedorHora)
    const salas = await obtenerSalas()

    let textoSalas = ""

    for (const [k, e] of Object.entries(salas)) {
        textoSalas += `<a class='salas' href='./?chat=${k}'>${e.nombre}</a>`
    }

    contenedorSalas.innerHTML = textoSalas


    botonCambiarNombre.addEventListener("click", () => {
        cambiarNombre(nuevoNombre)
    })

    nuevoNombre.addEventListener("keydown", (e) => {
        if (e.key == "Enter") cambiarNombre(nuevoNombre)
    })

    insertarImagen.addEventListener("click", () => {
        chatear(`<img src="${mensajeChat.value}">`)
    })

    botonChatear.addEventListener("click", () => {
        chatear(mensajeChat)
    })

    mensajeChat.addEventListener("keydown", (e) => {
        if (e.key == "Enter") chatear(mensajeChat)
    })

    botonFijados.addEventListener("click", (e) => {
        e.preventDefault();

        const rect = botonFijados.getBoundingClientRect();
        fijadosContainer.style.top = `${rect.bottom + window.scrollY}px`;
        fijadosContainer.style.left = `${rect.left + window.scrollX}px`;
        
        fijadosContainer.style.display = fijadosContainer.style.display == "block" ? "none" : "block";

        actualizarFijados()
    });

    setInterval(() => actualizarHora(contenedorHora), 1000)
    setInterval(recibirChat, 1000)
})

async function obtenerSalas() {
    let salas = {}
    await fetch(`${window.location.origin}/salas`)
        .then(res => res.json())
        .then(data => {
            salas = data
        })
    
    return salas
}

function cambiarNombre(nuevoNombre) {
    fetch(`${window.location.origin}/nombre`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre.value })
    })
    document.getElementById("nombre-actual").textContent = nuevoNombre.value
    
    nuevoNombre.value = ""
}

function chatear(mensajeChat) {
    let params = new URL(document.location.toString()).searchParams;
    let chatId = params.get("chat");

    fetch(`${window.location.origin}/salas/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: mensajeChat.value })
    })

    mensajeChat.value = ""
}

async function recibirChat() {
    const fijadosContainer = document.getElementById("fijados-container")
    const cuadroChat = document.getElementById("chat");
    const estabaAbajo = cuadroChat.scrollTop + cuadroChat.clientHeight >= cuadroChat.scrollHeight - 5;

    let params = new URL(document.location.toString()).searchParams;
    let chatId = params.get("chat");

    await fetch(`${window.location.origin}/salas/${chatId}?id=${ultimoId + 1}`)
        .then(res => res.json())
        .then(data => {
            let chat = cuadroChat.innerHTML

            data.forEach(e => {
                const tiempo = new Date(e.timestamp)
                historialChat.push(e)

                let respuesta = false
                let mensajeRespondido

                if (e.mensaje.startsWith("@")) {
                    let id = e.mensaje.split("@")[1]
                    mensajeRespondido = historialChat.find((m) => m.id == id)
                    respuesta = true
                }

                if (e.fijado) {
                    fijadosContainer.innerHTML += `<p>
                                <span class='id-chat'>#${e.id.toString().padStart(4, "0")}</span> 
                                <span class='horas-chat'>
                                    ${tiempo.getHours().toString().padStart(2, "0")}:${tiempo.getMinutes().toString().padStart(2, "0")}:${tiempo.getSeconds().toString().padStart(2, "0")}
                                </span> 
                                | <span class='nombre-chat'>${e.usuario}</span>: 
                                <span class='mensaje-chat'>${e.mensaje}</span>
                            </p>`
                }

                if (!respuesta || !mensajeRespondido) {
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
                }
            })
            cuadroChat.innerHTML = chat
        })

    if (estabaAbajo) {
        cuadroChat.scrollTop = cuadroChat.scrollHeight
    }
}

function actualizarHora(contenedorHora) {
    const horaActual = new Date()
    contenedorHora.innerHTML = `${horaActual.getHours().toString().padStart(2, "0")}:${horaActual.getMinutes().toString().padStart(2, "0")}:${horaActual.getSeconds().toString().padStart(2, "0")}`
}

async function actualizarFijados() {
    const fijadosContainer = document.getElementById("fijados-container");
    let params = new URL(document.location.toString()).searchParams;
    let chatId = params.get("chat");

    fijadosContainer.innerHTML = "";

    await fetch(`${window.location.origin}/salas/${chatId}`)
        .then(res => res.json())
        .then(data => {
            const fijados = data.filter(e => e.fijado)

            fijados.forEach(e => {
                const tiempo = new Date(e.timestamp);
                fijadosContainer.innerHTML += `<p>
                    <span class='id-chat'>#${e.id.toString().padStart(4, "0")}</span> 
                    <span class='horas-chat'>
                        ${tiempo.getHours().toString().padStart(2, "0")}:${tiempo.getMinutes().toString().padStart(2, "0")}:${tiempo.getSeconds().toString().padStart(2, "0")}
                    </span> 
                    | <span class='nombre-chat'>${e.usuario}</span>: 
                    <span class='mensaje-chat'>${e.mensaje}</span>
                </p>`;
            });
        })

}
