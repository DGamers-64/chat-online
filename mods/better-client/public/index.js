let ultimoId = -1
let tieneMensajesNuevos = false;
let historialChat = [];

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        document.querySelector("link[rel~='icon']").href = "./img/faviconApagado.ico"
        tieneMensajesNuevos = false;
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    let params = new URL(document.location.toString()).searchParams;
    let chatId = params.get("chat")
    const contenedorSalas = document.getElementById("salas")
    const cuadroChat = document.getElementById("chat");

    const salas = await obtenerSalas()
    let textoSalas = ""

    for (const [k, e] of Object.entries(salas)) {
        textoSalas += `<a class='salas' href='./?chat=${k}'>${e.nombre}</a>`
    }
    
    contenedorSalas.innerHTML = textoSalas

    if (!salas[chatId] || !chatId) {
        cuadroChat.style.display = "flex"
        cuadroChat.style.alignItems = "center"
        cuadroChat.style.justifyContent = "center"
        cuadroChat.innerHTML = "<h1 style='font-size: 4em;'>Selecciona una sala</h1>"
        return
    }

    const botonCambiarNombre = document.getElementById("cambiar-nombre-boton")
    const botonChatear = document.getElementById("chatear")
    const mensajeChat = document.getElementById("mensaje")
    const nuevoNombre = document.getElementById("nombre")
    const insertarImagen = document.getElementById("insertar-imagen")
    const contenedorHora = document.getElementById("hora")
    const fijadosContainer = document.getElementById("fijados-container")
    const botonFijados = document.getElementById("fijados")

    await fetch(`${window.location.origin}/nombre`)
        .then(res => res.json())
        .then(data => document.getElementById("nombre-actual").textContent = data[0])

    actualizarHora(contenedorHora)


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
    let chatId = params.get("chat")

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
                
                const mensajePlantilla = document.createElement("p")
                mensajePlantilla.id = `msg-${e.id}`
                mensajePlantilla.className = `mensajes-enteros`
                const idChat = document.createElement("span")
                idChat.className = "id-chat"
                idChat.textContent = `${e.id.toString().padStart(4, "0")}`
                const horasChat = document.createElement("span")
                horasChat.className = "horas-chat"
                horasChat.textContent = `${tiempo.toLocaleString("es-ES", { timeZone: "UTC" })}`
                const nombreChat = document.createElement("span")
                nombreChat.className = "nombre-chat"
                nombreChat.textContent = `${e.usuario}`
                const mensajeChat = document.createElement("span")
                mensajeChat.className = "mensaje-chat"
                if (respuesta) {
                    mensajeChat.textContent = e.mensaje.toString().split("@")[2]
                } else {
                    mensajeChat.textContent = e.mensaje
                }
                mensajePlantilla.appendChild(idChat)
                mensajePlantilla.appendChild(horasChat)
                mensajePlantilla.appendChild(nombreChat)
                mensajePlantilla.appendChild(mensajeChat)

                const cuadroMensaje = document.createElement("div")
                cuadroMensaje.className = "cuadro-mensaje"

                if (e.fijado) {
                    fijadosContainer.appendChild(mensajePlantilla)
                }

                if (!respuesta || !mensajeRespondido) {
                    cuadroMensaje.appendChild(mensajePlantilla)
                } else {
                    const citadoRespuesta = document.createElement("a")
                    citadoRespuesta.href = `#msg-${mensajeRespondido.id}`
                    citadoRespuesta.className = "respuesta-chat"
                    const idOriginal = document.createElement("span")
                    idOriginal.className = "id-respuesta"
                    idOriginal.textContent = mensajeRespondido.id.toString().padStart(4, "0")
                    const usuarioRespuesta = document.createElement("span")
                    usuarioRespuesta.className = "usuario-respuesta"
                    usuarioRespuesta.textContent = mensajeRespondido.usuario
                    const mensajeRespuesta = document.createElement("span")
                    mensajeRespuesta.className = "mensaje-respuesta"
                    mensajeRespuesta.textContent = mensajeRespondido.mensaje
                    citadoRespuesta.appendChild(idOriginal)
                    citadoRespuesta.appendChild(usuarioRespuesta)
                    citadoRespuesta.appendChild(mensajeRespuesta)
                    cuadroMensaje.appendChild(citadoRespuesta)
                    cuadroMensaje.appendChild(mensajePlantilla)
                }

                cuadroChat.appendChild(cuadroMensaje)

                ultimoId = e.id

                if (document.visibilityState !== "visible" && !tieneMensajesNuevos) {
                    document.querySelector("link[rel~='icon']").href = "./img/faviconEncendido.ico"
                    tieneMensajesNuevos = true;
                }
            })
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
