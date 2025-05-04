document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const modal = document.getElementById('retoModal');
  const cerrar = document.getElementById('cerrarModal');
  const textoReto = document.getElementById('textoReto');
  const imagenReto = document.getElementById('imagenReto');


  cards.forEach(card => {
    card.addEventListener('click', () => {
      const retoInfo = card.querySelector('.reto-info');
      const texto = retoInfo.querySelector('.texto-reto').textContent;
      const imagenSrc = retoInfo.querySelector('.img-reto').src;

      textoReto.textContent = texto;
      imagenReto.src = imagenSrc;

      // Girar la tarjeta
      card.classList.add('volteada');

      // Mostrar el modal
      modal.classList.add('show');
    });
  });

  cerrar.addEventListener('click', () => {
    modal.classList.remove('show');

    // Quitar giro sin transición
    cards.forEach(card => {
      card.classList.add('no-transicion');
      card.classList.remove('volteada');
      void card.offsetWidth; // Fuerza el reflow para aplicar cambio
      card.classList.remove('no-transicion');
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');

      cards.forEach(card => {
        card.classList.add('no-transicion');
        card.classList.remove('volteada');
        void card.offsetWidth;
        card.classList.remove('no-transicion');
      });
    }
  });
});

