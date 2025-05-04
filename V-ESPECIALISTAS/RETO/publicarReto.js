
const visualActual = document.getElementById('visualizacion-actual');
const opcionesVisual = document.getElementById('opciones-visual');
const opcionPacientes = document.getElementById('opcion-pacientes');
const listaPacientes = document.getElementById('lista-pacientes');
const cerrarLista = document.getElementById('cerrar-lista');
const botonListo = document.getElementById('btn-listo');
const checkboxes = listaPacientes.querySelectorAll('input[type="checkbox"]');

let seleccionados = [];

// Mostrar opciones al hacer clic
visualActual.addEventListener('click', () => {
  opcionesVisual.style.display = opcionesVisual.style.display === 'block' ? 'none' : 'block';
});

// Seleccionar "Mis pacientes"
document.querySelector('.opcion:nth-child(1)').addEventListener('click', () => {
    visualActual.innerHTML = 'Mis pacientes <span class="flecha-select"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#333" stroke-width="2" fill="none"/></svg></span>';
  listaPacientes.style.display = 'none';
  opcionesVisual.style.display = 'none';
});

// Seleccionar "Seleccionar pacientes"
opcionPacientes.addEventListener('click', () => {
    visualActual.innerHTML = 'Seleccionar pacientes <span class="flecha-select"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#333" stroke-width="2" fill="none"/></svg></span>';
  listaPacientes.style.display = 'block';
  opcionesVisual.style.display = 'none';

  // Restaurar checkboxes si ya había seleccionados
  checkboxes.forEach(cb => {
    cb.checked = seleccionados.includes(cb.nextElementSibling.innerText);
  });
});

// Botón cerrar
cerrarLista.addEventListener('click', () => {
    listaPacientes.style.display = 'none';
  
    // Limpiar selección de pacientes
    checkboxes.forEach(cb => cb.checked = false);
  
    // Limpiar también el array de seleccionados
    seleccionados = [];
  });
  
// Botón listo
botonListo.addEventListener('click', () => {
  seleccionados = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      seleccionados.push(cb.nextElementSibling.innerText);
    }
  });
  console.log("Seleccionados:", seleccionados);
  listaPacientes.style.display = 'none';
});

// Cerrar menú si se hace clic fuera
document.addEventListener('click', function (e) {
  if (!e.target.closest('.custom-select')) {
    opcionesVisual.style.display = 'none';
  }
});
