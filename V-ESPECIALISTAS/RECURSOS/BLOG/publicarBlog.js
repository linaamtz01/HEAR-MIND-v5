// Inicializar Quill
const quill = new Quill('#editor', {
    theme: 'snow'
});

// Abrir explorador de archivos al hacer clic en "Examinar"
document.getElementById('btnExaminar').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

// Mostrar vista previa de la imagen seleccionada
document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('fileName').textContent = 'Archivo seleccionado: ' + file.name;
            document.getElementById('preview-imagen').innerHTML = `<img src="${e.target.result}" />`;
        }
        reader.readAsDataURL(file);
    }
});

// Guardar como borrador
function guardarComoBorrador() {
    publicar(true);
}

// Función para subir o guardar como borrador
function publicar(esBorrador = false) {
    const titulo = document.getElementById('titulo').value;
    const enlace = document.getElementById('enlace').value;
    const contenidoHTML = quill.root.innerHTML;
    const imagenElemento = document.querySelector('#preview-imagen img');
    const imagen = imagenElemento ? imagenElemento.src : "";



    // Obtener categoría seleccionada
    const categoriaBtn = document.querySelector('.categoria-tag.seleccionada');
    const categoria = categoriaBtn ? categoriaBtn.textContent.trim() : 'Sin categoría';

    document.getElementById('preview-content').innerHTML = `
  <div class="post-card">
    ${imagen ? `<img src="${imagen}" alt="Imagen del post" class="post-img" />` : ""}
    <div class="post-content">
      <h2>${titulo}</h2>
      <p class="autor"><strong>Categoría:</strong> ${categoria}</p>
      ${enlace ? `<p><strong>Enlace:</strong> <a href="${enlace}" target="_blank">${enlace}</a></p>` : ""}
      <div class="extracto">${contenidoHTML}</div>
      <p style="color: gray;"><em>${esBorrador ? 'Guardado como borrador' : 'Publicado'}</em></p>
    </div>
  </div>
`;


   
        if (!esBorrador) {
            localStorage.removeItem("borradorReto"); // ⬅ limpia el borrador
            window.location.href = "../BLOG/blog.html"; 
        }
        
      
}

// Manejar selección de categorías visualmente
document.querySelectorAll('.categoria-tag').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.categoria-tag').forEach(b => b.classList.remove('seleccionada'));
        this.classList.add('seleccionada');
    });
});


// Función para guardar el borrador
function guardarComoBorrador() {
    const titulo = document.getElementById('titulo').value;
    const enlace = document.getElementById('enlace').value;
    const contenidoHTML = quill.root.innerHTML;
    const imagenElemento = document.querySelector('#preview-imagen img');
    const imagen = imagenElemento ? imagenElemento.src : '';
    const categoriaBtn = document.querySelector('.categoria-tag.seleccionada');
    const categoria = categoriaBtn ? categoriaBtn.textContent.trim() : 'Sin categoría';

    // Crear objeto borrador
    const borrador = {
        titulo: titulo,
        enlace: enlace,
        contenido: contenidoHTML,
        imagen: imagen,
        categoria: categoria
    };

    // Guardar el borrador en localStorage
    localStorage.setItem('borradorReto', JSON.stringify(borrador));
}

// Función para cargar el borrador al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const borrador = JSON.parse(localStorage.getItem("borradorReto"));

    if (borrador) {
        // Restaurar datos del borrador
        document.getElementById("titulo").value = borrador.titulo;
        document.getElementById("enlace").value = borrador.enlace;
        quill.root.innerHTML = borrador.contenido;

        // Mostrar imagen si existe
        if (borrador.imagen) {
            document.getElementById('fileName').textContent = 'Archivo seleccionado: ' + borrador.imagen;
            document.getElementById('preview-imagen').innerHTML = `<img src="${borrador.imagen}" />`;
        }

        // Establecer categoría seleccionada
        document.querySelectorAll('.categoria-tag').forEach(btn => {
            if (btn.textContent.trim() === borrador.categoria) {
                btn.classList.add('seleccionada');
            }
        });
    }
});
