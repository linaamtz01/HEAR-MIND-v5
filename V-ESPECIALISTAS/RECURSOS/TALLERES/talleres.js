let contadorTalleres = 1;
let talleres = {};
let tallerEditandoId = null;

function abrirModal(id) {
  document.getElementById(id).style.display = 'block';
}
function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) modal.style.display = 'none';
  });
}
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 3000); // Se esconde en 3 segundos
}

let tallerAEliminar = null;

function eliminarTaller(btn) {
  tallerAEliminar = btn.closest('.taller-card');
  abrirModal('modalConfirmacion');
}

function confirmarEliminacion() {
  if (tallerAEliminar) {
    tallerAEliminar.remove();
    mostrarToast('Taller eliminado con éxito');
    tallerAEliminar = null;
  }
  cerrarModal('modalConfirmacion');
}
// PUBLICAR
function publicarTaller() {
  const titulo = document.getElementById('tituloPublicar').value;
  const fecha = document.getElementById('fechaPublicar').value;
  const descripcion = document.getElementById('descripcionPublicar').value;
  const archivo = document.getElementById('archivoPublicar').files[0];

  if (!titulo || !fecha || !descripcion) {
    mostrarToast("Por favor completa todos los campos.");
    return;
  }

  const nuevoId = `taller-${contadorTalleres++}`;

  talleres[nuevoId] = {
    titulo,
    fecha,
    descripcion,
    archivo
  };

  const nuevoTaller = document.createElement('div');
  nuevoTaller.classList.add('taller-card');
  nuevoTaller.setAttribute('data-id', nuevoId);
  nuevoTaller.innerHTML = `
    <h3><i class="fi fi-rr-to-do"></i> ${titulo}</h3>
    <div class="meta">
      <span class="tag verde">Publicado</span>
    </div>
    <div class="meta fecha"><i class="fi fi-rr-calendar"></i> ${fecha.split('-').reverse().join('/')}</div>
    <p class="meta">Archivo: <a href="#">Descargar PDF</a></p>
    <div class="botones">
      <button class="ver" data-id="${nuevoId}" onclick="verTaller(this)"><i class="fi fi-rr-eye"></i> Ver</button>
      <button class="editar" data-id="${nuevoId}" onclick="editarTaller(this)"><i class="fi fi-rr-pencil"></i> Editar</button>
      <button class="eliminar" onclick="eliminarTaller(this)"><i class="fi fi-rr-trash"></i> Eliminar</button>
    </div>
  `;
  document.querySelector('.taller-list').prepend(nuevoTaller);

  mostrarToast('Taller publicado con éxito');
  cerrarModal('modalPublicar');

  // Limpiar campos
  document.getElementById('tituloPublicar').value = '';
  document.getElementById('fechaPublicar').value = '';
  document.getElementById('descripcionPublicar').value = '';
  document.getElementById('archivoPublicar').value = '';
}


function verTaller(btn) {
  const id = btn.dataset.id;
  const taller = talleres[id];
  if (!taller) return;

  // Actualizar visualmente el modal de VER
  document.querySelector('#modalVer h2').innerHTML = `<i class="fi fi-rr-to-do"></i> ${taller.titulo}`;
  document.querySelector('#modalVer .modal-content p:nth-of-type(1)').innerHTML = `<i class="fi fi-rr-calendar-check"></i><strong>Fecha:</strong> ${taller.fecha.split('-').reverse().join('/')}`;
document.querySelector('#modalVer .modal-content p.meta').innerHTML = `<strong>Descripción:</strong> ${taller.descripcion}`;


  // Actualizar el enlace de descarga si hay archivo
  const archivoLink = document.querySelector('#modalVer a');
if (taller.archivo) {
    const blobUrl = URL.createObjectURL(taller.archivo);
    archivoLink.href = blobUrl;
    archivoLink.download = taller.archivo.name;
    archivoLink.innerHTML = `<i class="fi fi-rr-file"></i> ${taller.archivo.name}`;
} else {
    archivoLink.removeAttribute('href');
    archivoLink.innerHTML = `<i class="fi fi-rr-file"></i> No hay archivo`;
}


  abrirModal('modalVer');
}



function editarTaller(btn) {
  const id = btn.dataset.id;
  const taller = talleres[id];
  if (!taller) return;

  tallerEditandoId = id;

  document.getElementById('tituloEditar').value = taller.titulo;
  document.getElementById('fechaEditar').value = taller.fecha;
  document.getElementById('descripcionEditar').value = taller.descripcion;

  abrirModal('modalEditar');
}


function guardarCambios() {
  const titulo = document.getElementById('tituloEditar').value;
  const fecha = document.getElementById('fechaEditar').value;
  const descripcion = document.getElementById('descripcionEditar').value;
  const archivo = document.getElementById('archivoEditar').files[0];

  if (!tallerEditandoId) return;

  // Actualizar datos del taller
  talleres[tallerEditandoId] = {
    ...talleres[tallerEditandoId],
    titulo,
    fecha,
    descripcion
  };

  // Actualizar visualmente la tarjeta del taller
  const tarjeta = document.querySelector(`[data-id="${tallerEditandoId}"]`);
  if (tarjeta) {
    tarjeta.querySelector('h3').innerHTML = `<i class="fi fi-rr-to-do"></i> ${titulo}`;
    tarjeta.querySelector('.fecha').innerHTML = `<i class="fi fi-rr-calendar"></i> ${fecha.split('-').reverse().join('/')}`;
  }

  // Si se seleccionó un nuevo archivo, actualízalo
  if (archivo) {
    talleres[tallerEditandoId].archivo = archivo;

    // Actualiza texto del enlace si existe
    const enlace = tarjeta?.querySelector('a');
    if (enlace) enlace.textContent = `Archivo: ${archivo.name}`;
  }

 // Mostrar mensaje de éxito
mostrarToast('Cambios guardados correctamente');

// 👇 Esto debe ir antes de cerrar el modal
const modalVer = document.getElementById('modalVer');
verTaller(document.querySelector(`.ver[data-id="${tallerEditandoId}"]`));

// Cerrar el modal de edición
cerrarModal('modalEditar');

}


// Inicializar talleres de muestra ya existentes
document.querySelectorAll('.taller-card').forEach(card => {
  const id = card.dataset.id;
  const titulo = card.querySelector('h3').innerText.replace(/^.*? /, '');
  const fechaTexto = card.querySelector('.fecha').innerText.match(/\d{2}\/\d{2}\/\d{4}/)[0];
  const fecha = fechaTexto.split('/').reverse().join('-'); // YYYY-MM-DD

  const descripcionParrafo = card.querySelector('.descripcion');
  const descripcionTexto = descripcionParrafo ? descripcionParrafo.textContent.trim() : '';


  talleres[id] = {
    titulo,
    fecha,
    descripcion: descripcionTexto,
    archivo: null
  };
});

if (taller.archivo) {
  const blobUrl = URL.createObjectURL(taller.archivo);
  archivoLink.href = blobUrl;
  archivoLink.download = taller.archivo.name;
  archivoLink.innerHTML = `<i class="fi fi-rr-file"></i> ${taller.archivo.name}`;
} else {
  archivoLink.removeAttribute('href');
  archivoLink.innerHTML = `<i class="fi fi-rr-file"></i> No hay archivo`;
}

function abrirModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'block';
  modal.classList.add('visible');
}

function cerrarModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'none';
  modal.classList.remove('visible');
}

if (modalVer.classList.contains('visible')) {
  verTaller({ dataset: { id: tallerEditandoId } });
}

document.addEventListener('DOMContentLoaded', () => {
  const archivoInput = document.getElementById('archivoEditar');
  const nombreArchivo = document.getElementById('nombreArchivo');

  archivoInput.addEventListener('change', () => {
    nombreArchivo.textContent = archivoInput.files.length > 0
      ? archivoInput.files[0].name
      : 'Ningún archivo seleccionado';
  });
});
