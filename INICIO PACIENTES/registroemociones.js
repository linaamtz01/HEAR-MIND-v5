const ruleta = document.getElementById("ruleta");
const estados = [
    "triste",   
    "preocupado", 
    "frustrado",
    "enojado",
    "entusiasmado",
    "feliz"
];

const imagenes = [
    "../IMG/triste.png",
    "../IMG/preocupado.png",
    "../IMG/frustrado.png",
    "../IMG/enojado.png",
    "../IMG/entusiasmado.png",
    "../IMG/feliz.png"
];

let anguloActual = 0;
let inicioAngulo = 0;
let girando = false;
let velocidad = 0;

// **Cuando el usuario toca la ruleta**
function iniciarGiro(event) {
    girando = true;
    let x = event.touches ? event.touches[0].clientX : event.clientX;
    let y = event.touches ? event.touches[0].clientY : event.clientY;

    let rect = ruleta.getBoundingClientRect();
    let centroX = rect.left + rect.width / 2;
    let centroY = rect.top + rect.height / 2;
    inicioAngulo = Math.atan2(y - centroY, x - centroX) * (180 / Math.PI);
}

// **Cuando el usuario mueve el dedo o el mouse**
function girarRuleta(event) {
    if (!girando) return;

    let x = event.touches ? event.touches[0].clientX : event.clientX;
    let y = event.touches ? event.touches[0].clientY : event.clientY;

    let rect = ruleta.getBoundingClientRect();
    let centroX = rect.left + rect.width / 2;
    let centroY = rect.top + rect.height / 2;
    let nuevoAngulo = Math.atan2(y - centroY, x - centroX) * (180 / Math.PI);

    velocidad = nuevoAngulo - inicioAngulo;
    anguloActual += velocidad;
    inicioAngulo = nuevoAngulo;

    ruleta.style.transform = `rotate(${anguloActual}deg)`;
}

// **Cuando el usuario suelta la ruleta, aplica inercia**
function detenerGiro() {
    girando = false;

    // **Efecto de inercia**
    let intervalo = setInterval(() => {
        if (Math.abs(velocidad) < 0.1) {
            clearInterval(intervalo);
            velocidad = 0;
            actualizarEstado();
            return;
        }
        
        anguloActual += velocidad;
        velocidad *= 0.95; // Reduce la velocidad poco a poco
        ruleta.style.transform = `rotate(${anguloActual}deg)`;
    }, 20);
}

// **Actualiza el estado de ánimo según el ángulo**
function actualizarEstado() {
    let anguloNormalizado = ((anguloActual % 360) + 360) % 360;
    let index = Math.floor(anguloNormalizado / 60) % 6; // Dividimos en 6 secciones de 60 grados

    document.getElementById("estado-actual").innerText = "Me siento " + estados[index];
    document.getElementById("emocion-imagen").src = imagenes[index]; // Cambia la imagen
}

// **Eventos de Mouse y Touch**
ruleta.addEventListener("mousedown", iniciarGiro);
ruleta.addEventListener("mousemove", girarRuleta);
ruleta.addEventListener("mouseup", detenerGiro);
ruleta.addEventListener("mouseleave", detenerGiro);

ruleta.addEventListener("touchstart", iniciarGiro);
ruleta.addEventListener("touchmove", girarRuleta);
ruleta.addEventListener("touchend", detenerGiro);

/*

function guardarEstado() {
    let fecha = new Date();
    let dia = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    let estadosGuardados = JSON.parse(localStorage.getItem("estados")) || {};
    
    estadosGuardados[dia] = estados[index]; // Guarda la imagen correspondiente al día

    localStorage.setItem("estados", JSON.stringify(estadosGuardados)); // Guarda en el navegador
}

// Llama esta función después de actualizar el estado
function actualizarEstado() {
    let anguloNormalizado = ((anguloActual % 360) + 360) % 360;
    let index = Math.floor((anguloNormalizado / 120)) % 3;
    estadoImagen.src = estados[index];

    guardarEstado(); // Guarda el estado en localStorage
}
    */