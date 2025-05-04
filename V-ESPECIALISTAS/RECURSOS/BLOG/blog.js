

const articulos = [
    {
      titulo: "¿Cómo ser más productivo?",
      autor: "Juliana Gomez",
      tiempo: "Hace 1 hora",
      estado: "publicado",
      avatar: "../../../IMG/productivo-1.png",
      archivo: "../BLOG/INFORMATIVO/productividad.html" 
    },
    {
      titulo: "Soledad emocional",
      autor: "Rodrigo Gonzales",
      tiempo: "Hace 1 hora",
      estado: "borrador",
      avatar: "../../../IMG/soledad.png",
      archivo: "publicarBlog.html"
    }
  ];

  function renderArticulosPorEstado(lista, estado, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = ''; // Limpiar el contenedor

    // Filtrar los artículos por estado
    const filtrados = lista.filter(articulo => articulo.estado === estado);

    // Crear y agregar cada artículo filtrado al contenedor
    filtrados.forEach((articulo) => {
      const card = document.createElement('div');
      card.className = `card-articulo ${estado}`;

      card.innerHTML = `
        <img src="${articulo.avatar}" alt="avatar" />
        <div class="info">
          <strong>${articulo.titulo}</strong>
          <small>${articulo.autor}</small>
          <small>${articulo.tiempo}</small>
          ${estado === 'borrador' ? '<span class="badge">Borrador</span>' : ''}
        </div>
      `;

      // Evento de clic en la tarjeta del artículo
      card.addEventListener("click", () => {
        if (estado === 'borrador') {
          // Guardar el borrador en localStorage y redirigir a la página de publicación
          localStorage.setItem("borradorReto", JSON.stringify(articulo));
          window.location.href = "publicarBlog.html";
        } else if (articulo.archivo) {
          // Redirigir al archivo correspondiente si el artículo está publicado
          window.location.href = articulo.archivo;
        }
      });

      // Agregar la tarjeta al contenedor
      contenedor.appendChild(card);
    });
  }

  // Llamar a la función para renderizar los artículos
  renderArticulosPorEstado(articulos, 'publicado', 'articulos-publicados');
  renderArticulosPorEstado(articulos, 'borrador', 'articulos-borradores');