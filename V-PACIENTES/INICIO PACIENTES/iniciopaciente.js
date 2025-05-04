// Función para obtener datos de emociones desde localStorage
function cargarEmociones() {
    const emociones = JSON.parse(localStorage.getItem("emociones")) || {
        L: 40, M: 70, X: 50, J: 80, V: 100, S: 70, D: 30
    };

    // Definir colores de las emociones
    const colores = ["yellow", "teal", "green", "purple", "red", "yellow", "brown"];
    
    // Asignar valores a cada barra
    Object.keys(emociones).forEach((dia, index) => {
        let bar = document.getElementById(`bar-${dia.toLowerCase()}`);
        if (bar) {
            bar.style.height = emociones[dia] + "%";
            bar.style.backgroundColor = colores[index];
        }
    });
}

// Llamar a la función al cargar la página
cargarEmociones();


// Obtener elementos del DOM
const modal = document.getElementById("modalNotificaciones");
const btn = document.getElementById("btnNotificacion");
const closeBtn = document.querySelector(".close");

// Cuando el usuario hace clic en el botón, se muestra el modal
btn.onclick = function() {
    modal.style.display = "flex";
}

// Cuando el usuario hace clic en la "X", se cierra el modal
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, también se cierra
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

//Guardar emociones de la ruleta
document.addEventListener("DOMContentLoaded", () => {
    let estadosGuardados = JSON.parse(localStorage.getItem("estados")) || {};

    for (let i = 0; i < 7; i++) {
        let imagen = document.querySelector(`#day-${i} img`);
        if (estadosGuardados[i]) {
            imagen.src = estadosGuardados[i]; // Muestra la imagen guardada
        }
    }
});

const fechaElemento = document.querySelector(".fecha");
  const opciones = {  month: 'long', day: 'numeric' };
  const fecha = new Date().toLocaleDateString('es-ES', opciones);
  fechaElemento.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  document.addEventListener('DOMContentLoaded', function() {

    const menuItems = document.querySelectorAll('.menu .list');
 
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
 
            
 
            menuItems.forEach(item => item.classList.remove('active'));
 
          
            this.classList.add('active');
        });
    });
 });


 