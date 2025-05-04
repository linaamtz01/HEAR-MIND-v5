
document.getElementById('buscador').addEventListener('input', function () {
    const filtro = this.value.toLowerCase();
    const tarjetas = document.querySelectorAll('.section .patient-card');
    const titulosTodos = document.querySelectorAll('.section .titulo-seccion');
    const seccionRecientes = document.querySelector('.section-R');
  
    // Siempre ocultar "Recientes" al escribir algo
    if (filtro) {
      if (seccionRecientes) seccionRecientes.style.display = 'none';
    } else {
      if (seccionRecientes) seccionRecientes.style.display = 'block';
    }
  
    // Ocultar o mostrar título de "Todos"
    titulosTodos.forEach(function (titulo) {
      titulo.style.display = filtro ? 'none' : 'block';
    });
  
    // Filtrar solo tarjetas de la sección "Todos"
    tarjetas.forEach(function (tarjeta) {
      const nombreElemento = tarjeta.querySelector('.patient-name');
      if (!nombreElemento) return;
  
      const nombre = nombreElemento.textContent.toLowerCase();
      tarjeta.style.display = nombre.includes(filtro) ? 'flex' : 'none'; // o 'block'
    });
  
    // Mostrar título si hay resultados visibles
    document.querySelectorAll('.section').forEach(function (seccion) {
      const visibles = Array.from(seccion.querySelectorAll('.patient-card'))
        .filter(card => card.style.display !== 'none');
  
      const titulo = seccion.querySelector('.titulo-seccion');
      if (titulo) {
        titulo.style.display = filtro && visibles.length > 0 ? 'block' : (filtro ? 'none' : 'block');
      }
    });
  });
//Click para ir al perfil
  document.querySelectorAll('.patient-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const url = this.getAttribute('src');
      if (url) {
        window.location.href = url;
      }
    });
  });

  