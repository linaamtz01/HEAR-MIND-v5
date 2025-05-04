let cartaActiva = null;

function voltearCarta(cardElement) {
  if (cartaActiva) return; // Prevenir múltiples clics
  cartaActiva = cardElement;
  cardElement.classList.add('flipped');
  setTimeout(() => {
    mostrarReto();
  }, 700);
}

function mostrarReto() {
  document.getElementById('popup').style.display = 'flex';
}

function cerrarReto() {
  document.getElementById('popup').style.display = 'none';
  if (cartaActiva) {
    cartaActiva.classList.remove('flipped');
    cartaActiva = null;
  }
}

function marcarHecho() {
  mostrarToast('¡Bien hecho!');
  cerrarReto();
}

function postergarReto() {
  mostrarToast('Reto postergado para más tarde');
  cerrarReto();
}

document.getElementById("botonAplazar").addEventListener("click", function () {
  const popup = document.getElementById("popup");
  popup.style.display = "none";

  // Mostrar sección de aplazados
  const aplazados = document.getElementById("aplazados");
  aplazados.style.display = "block";

  // Agregar reto aplazado
  const lista = document.getElementById("aplazados-lista");
  const nuevoReto = document.createElement("div");
  nuevoReto.className = "aplazado-item";
  nuevoReto.innerHTML = `
  <div class="aplazado-item-content">
    <i class="fa-solid fa-clock-rotate-left"></i>
    <p> Mírate en el espejo una vez al día</p>
    <button class="completar-btn">Completado</button>
  </div>
`;


  lista.appendChild(nuevoReto);

  // Evento para marcar como completado
  nuevoReto.querySelector(".completar-btn").addEventListener("click", function () {
    lista.removeChild(nuevoReto);
    if (lista.children.length === 0) {
      aplazados.style.display = "none";
    }
  });
});

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000); // Se esconde en 3 segundos
}


