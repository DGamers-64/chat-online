let containerJuegos
let contenidoBaseJuegos
let puntuacionSudoku = 0

document.addEventListener("DOMContentLoaded", () => {
    const botonJuegos = document.getElementById("juegos")
    containerJuegos = document.getElementById("juegos-container")
    contenidoBaseJuegos = containerJuegos.innerHTML
    const main = document.querySelector("main")

    botonJuegos.addEventListener("click", (e) => {
        e.preventDefault()

        if (containerJuegos.style.display === "block") {
            containerJuegos.style.display = "none"
            main.style.gridTemplateAreas = `
                "botones-arriba salas"
                "chat salas"
                "inputs salas"
            `
            main.style.gridTemplateColumns = "7fr 1fr"

            containerJuegos.innerHTML = contenidoBaseJuegos

            asignarEventosJuegos()
        } else {
            containerJuegos.style.display = "block"
            containerJuegos.className = ""
            main.style.gridTemplateAreas = `
                "botones-arriba botones-arriba salas"
                "juegos chat salas"
                "juegos inputs salas"
            `
            main.style.gridTemplateColumns = "5fr 2fr 1fr"
        }
    })

    asignarEventosJuegos()
})

function asignarEventosJuegos() {
    const botonSudoku = document.getElementById("entrada-juego-sudoku")
    const botonSnake = document.getElementById("entrada-juego-snake")
    const botonAhorcado = document.getElementById("entrada-juego-ahorcado")

    if (botonSudoku) botonSudoku.addEventListener("click", sudoku)
    if (botonSnake) botonSnake.addEventListener("click", snake)
    if (botonAhorcado) botonAhorcado.addEventListener("click", ahorcado)
}

function sudoku() {
    containerJuegos.innerHTML = `
    <div class="sudoku">
        <span id="puntuacion-actual">${puntuacionSudoku}</span>
        <table>
            ${Array.from({length: 9}).map((_, fila) => `
                <tr${[2,5].includes(fila) ? ' class="celda-borde-abajo"' : ''}>
                ${Array.from({length: 9}).map((_, col) => `
                    <td${[2,5].includes(col) ? ' class="celda-borde-derecha"' : ''}>
                        <input type="number" min="1" max="9">
                    </td>
                `).join('')}
                </tr>
            `).join('')}
        </table>
        <button id="comprobar-sudoku">Comprobar</button>
    </div>`;

    document.querySelector(".sudoku").style.backgroundColor = colorAleatorio([100, 200], [100, 200], [100, 200]);
    const inputs = document.querySelectorAll(".sudoku input");

    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^1-9]/g, '');
            if (e.target.value.length > 1) e.target.value = e.target.value[0];
        });
    });

    const N = 9;
    const tablero = Array.from({ length: N }, () => Array(N).fill(0));

    function esValido(tablero, fila, col, num) {
        for (let i = 0; i < N; i++)
            if (tablero[fila][i] === num || tablero[i][col] === num) return false;

        const startFila = Math.floor(fila / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (tablero[startFila+i][startCol+j] === num) return false;

        return true;
    }

    function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

    function llenarTablero(tablero) {
        for (let fila = 0; fila < N; fila++) {
            for (let col = 0; col < N; col++) {
                if (tablero[fila][col] === 0) {
                    let numeros = shuffle([1,2,3,4,5,6,7,8,9]);
                    for (let num of numeros) {
                        if (esValido(tablero, fila, col, num)) {
                            tablero[fila][col] = num;
                            if (llenarTablero(tablero)) return true;
                            tablero[fila][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    llenarTablero(tablero);

    const celdas = [];
    for (let f = 0; f < N; f++)
        for (let c = 0; c < N; c++)
            celdas.push([f, c]);

    shuffle(celdas);

    const solucion = tablero.map(row => row.slice());

    const visibles = celdas.slice(0, 32);

    inputs.forEach((input, i) => {
        const fila = Math.floor(i / 9);
        const col = i % 9;
        if (visibles.some(([f, c]) => f === fila && c === col)) {
            input.value = tablero[fila][col];
            input.readOnly = true;
            input.classList.add('cpu');
        } else {
            input.value = '';
            input.readOnly = false;
            input.classList.remove('cpu');
        }
    });

    const botonComprobar = document.getElementById("comprobar-sudoku");
    botonComprobar.addEventListener("click", () => {
        let correcto = true;
        inputs.forEach((input, i) => {
            const fila = Math.floor(i / 9);
            const col = i % 9;
            const valor = parseInt(input.value, 10);
            if (valor !== solucion[fila][col]) correcto = false;
        });

        if (correcto) {
            puntuacionSudoku++;
            document.getElementById("puntuacion-actual").textContent = puntuacionSudoku;
            sudoku();
        } else {
            alert("¡Incorrecto!");
        }
    });
}

function snake() {
    containerJuegos.innerHTML = `
    <div class="snake-game">
        <span id="puntuacion-actual">0</span>
        <canvas id="snake-canvas" style="width: 30rem; height: 30rem;"></canvas>
    </div>`

    document.querySelector(".snake-game").style.backgroundColor = colorAleatorio([100, 200], [100, 200], [100, 200])

    const canvas = document.getElementById("snake-canvas")
    const ctx = canvas.getContext("2d")

    const estilo = getComputedStyle(canvas);
    const anchoVisual = parseFloat(estilo.width);
    const altoVisual = parseFloat(estilo.height);

    canvas.width = anchoVisual;
    canvas.height = altoVisual;

    const N = 20;
    const size = canvas.width / N;

    let snake = [{x: 10, y: 10}];
    let dir = {x: 0, y: 0};
    let puntuacion = 0;

    document.getElementById("puntuacion-actual").textContent = puntuacion;

    ctx.fillStyle = "#008500ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function nuevaComida() {
        let c;
        do {
            c = {x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N)};
        } while (snake.some(s => s.x === c.x && s.y === c.y));
        return c;
    }
    let comida = nuevaComida();

    document.addEventListener("keydown", e => {
        if(e.key === "ArrowUp" && dir.y !== 1) dir = {x: 0, y: -1};
        else if(e.key === "ArrowDown" && dir.y !== -1) dir = {x: 0, y: 1};
        else if(e.key === "ArrowLeft" && dir.x !== 1) dir = {x: -1, y: 0};
        else if(e.key === "ArrowRight" && dir.x !== -1) dir = {x: 1, y: 0};
    });

    function gameLoop() {
        if(dir.x === 0 && dir.y === 0) return;

        const cabeza = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

        if(cabeza.x < 0 || cabeza.x >= N || cabeza.y < 0 || cabeza.y >= N || 
           snake.some((s, i) => i > 0 && s.x === cabeza.x && s.y === cabeza.y)) {
            alert("¡Has perdido! Puntuación: " + puntuacion);
            snake = [{x: 10, y: 10}];
            dir = {x: 0, y: 0};
            puntuacion = 0;
            document.getElementById("puntuacion-actual").textContent = puntuacion;
            comida = nuevaComida();
            return;
        }

        snake.unshift(cabeza);

        if(cabeza.x === comida.x && cabeza.y === comida.y) {
            puntuacion++;
            document.getElementById("puntuacion-actual").textContent = puntuacion;
            comida = nuevaComida();
        } else {
            snake.pop();
        }

        ctx.fillStyle = "#008500ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.fillRect(comida.x * size, comida.y * size, size, size);

        snake.forEach((s, i) => {
            ctx.fillStyle = i % 2 === 0 ? "#003366" : "#3399ff";
            ctx.fillRect(s.x * size, s.y * size, size, size);
        });

        const cabezaPixel = {x: cabeza.x * size, y: cabeza.y * size};
        const ojoSize = size * 0.25;
        const pupilaSize = ojoSize * 0.5;

        let ojo1 = {x: 0, y: 0};
        let ojo2 = {x: 0, y: 0};
        let pupila1 = {x: 0, y: 0};
        let pupila2 = {x: 0, y: 0};

        if(dir.x === 1) {
            ojo1 = {x: cabezaPixel.x + size*0.7, y: cabezaPixel.y + size*0.2};
            ojo2 = {x: cabezaPixel.x + size*0.7, y: cabezaPixel.y + size*0.55};
        } else if(dir.x === -1) {
            ojo1 = {x: cabezaPixel.x + size*0.05, y: cabezaPixel.y + size*0.2};
            ojo2 = {x: cabezaPixel.x + size*0.05, y: cabezaPixel.y + size*0.55};
        } else if(dir.y === -1) {
            ojo1 = {x: cabezaPixel.x + size*0.2, y: cabezaPixel.y + size*0.05};
            ojo2 = {x: cabezaPixel.x + size*0.55, y: cabezaPixel.y + size*0.05};
        } else if(dir.y === 1) {
            ojo1 = {x: cabezaPixel.x + size*0.2, y: cabezaPixel.y + size*0.7};
            ojo2 = {x: cabezaPixel.x + size*0.55, y: cabezaPixel.y + size*0.7};
        }

        pupila1 = {x: ojo1.x + ojoSize*0.25, y: ojo1.y + ojoSize*0.25};
        pupila2 = {x: ojo2.x + ojoSize*0.25, y: ojo2.y + ojoSize*0.25};

        ctx.fillStyle = "white";
        ctx.fillRect(ojo1.x, ojo1.y, ojoSize, ojoSize);
        ctx.fillRect(ojo2.x, ojo2.y, ojoSize, ojoSize);

        ctx.fillStyle = "black";
        ctx.fillRect(pupila1.x, pupila1.y, pupilaSize, pupilaSize);
        ctx.fillRect(pupila2.x, pupila2.y, pupilaSize, pupilaSize);
    }

    setInterval(gameLoop, 150);
}

function ahorcado() {
    
}

function colorAleatorio(rangoR = [0, 255], rangoG = [0, 255], rangoB = [0, 255]) {
    const r = Math.floor(Math.random() * (rangoR[1] - rangoR[0] + 1)) + rangoR[0]
    const g = Math.floor(Math.random() * (rangoG[1] - rangoG[0] + 1)) + rangoG[0]
    const b = Math.floor(Math.random() * (rangoB[1] - rangoB[0] + 1)) + rangoB[0]
    return `rgb(${r}, ${g}, ${b})`
}