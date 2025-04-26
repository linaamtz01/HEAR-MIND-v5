
  const form = document.getElementById('formBusqueda');
  const input = document.getElementById('busqueda');
  const button = document.getElementById('btnBuscar');
  const resultados = document.getElementById('resultados');

  const especialistas = [
    { nombre: "Dr. Rodrigo Gonzales", especialidad: "Psicología clínica", archivo: "Perfiles/RodrigoG.html" },
    { nombre: "Dra. Julia Mendoza", especialidad: "Psiquiatría general", archivo: "Perfiles/JuliaM.html" },
    { nombre: "Dra. Juliana Gomez", especialidad: "Psicología clínica", archivo: "Perfiles/JulianaG.html" },
    { nombre: "Dr. Santiago Mendez", especialidad: "Psicología clínica", archivo: "Perfiles/SantiagoM.html" },
    { nombre: "Dra. Alejandra Robles", especialidad: "Psicología clínica", archivo: "Perfiles/AlejandraR.html" },
    { nombre: "Dra. Catalina Mejia", especialidad: "Psicología infantil", archivo: "Perfiles/CatalinaM.html" },
    { nombre: "Dr. Alex Martinez", especialidad: "Psicología infantil", archivo: "Perfiles/AlexM.html" },
    { nombre: "Dra. Camila Barreto", especialidad: "Psicología infantil", archivo: "Perfiles/CamilaB.html" },
    { nombre: "Dr. Roberto Dominguez", especialidad: "Psiquiatria general", archivo: "Perfiles/RobertoD.html" },
    { nombre: "Dra. Lucia Ramirez", especialidad: "Psiquiatria general", archivo: "Perfiles/LuciaR.html" },
    { nombre: "Dr. Hernando Cabal", especialidad: "Psiquiatria general", archivo: "Perfiles/HernandoC.html" },
    { nombre: "Dr. Gabriel Ruiz", especialidad: "Psiquiatria infantil", archivo: "Perfiles/GabrielR.html" },
    { nombre: "Dra. Silvia Lopez", especialidad: "Psiquiatria infantil", archivo: "Perfiles/SilviaL.html" },
    { nombre: "Dr. Andres Ortega", especialidad: "Psiquiatria infantil", archivo: "Perfiles/AndresO.html" },
    { nombre: "Dra. Laura Londoño", especialidad: "Terapeuta Ocupacional", archivo: "Perfiles/LauraL.html" },
    { nombre: "Dra. Melissa Cortes", especialidad: "Terapeuta Ocupacional", archivo: "Perfiles/MelissaC.html" },
    { nombre: "Dr. Cristhian Lopez", especialidad: "Terapeuta Ocupacional", archivo: "Perfiles/Cristhian.html" },
    { nombre: "Dra. Katherin Barreto", especialidad: "Psicoterapeuta familiar", archivo: "Perfiles/KatherinB.html" },
    { nombre: "Dra. Sara Valencia", especialidad: "Psicoterapeuta familiar", archivo: "Perfiles/SaraV.html" },
    { nombre: "Dra. Cristina Rojas", especialidad: "Psicoterapeuta pareja", archivo: "Perfiles/CristinaR.html" },
    { nombre: "Dra. Ximena Rivera", especialidad: "Psicoterapeuta pareja", archivo: "Perfiles/XimenaR.html" }
  ];

  function realizarBusqueda() {
    const texto = input.value.toLowerCase().trim();
    resultados.innerHTML = "";
  
    if (texto === '') return;
  
    const filtrados = especialistas.filter(e =>
      e.nombre.toLowerCase().includes(texto) ||
      e.especialidad.toLowerCase().includes(texto)
    );
  
    if (filtrados.length === 0) {
      resultados.innerHTML = '<div class="no-result">No se encontraron especialistas.</div>';
      return;
    }
  
    // Crear un solo contenedor para los resultados
    const grupo = document.createElement("div");
    grupo.className = "grupo-especialistas";
  
    filtrados.forEach(e => {
      const div = document.createElement("div");
      div.className = "tarjeta-especialista";
      div.innerHTML = `
        <h3>${e.nombre}</h3>
        <p>${e.especialidad}</p>
      `;
      div.onclick = () => {
        window.location.href = e.archivo;
      };
      grupo.appendChild(div);
    });
  
    resultados.appendChild(grupo);
  }
  

  // Evento al enviar formulario (botón o enter)
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.classList.add('clicked');
    realizarBusqueda();
    setTimeout(() => button.classList.remove('clicked'), 300);
  });

  // Activación visual de categorías (si tienes esa funcionalidad)
  const categorias = document.querySelectorAll('.categoria');
  categorias.forEach(cat => {
    cat.addEventListener('click', () => {
      categorias.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
    });
  });

  
  document.addEventListener('DOMContentLoaded', function () {
    const liItems = document.querySelectorAll('.menu .list');
    const indicador = document.querySelector('.indicador');

    // Leemos el índice guardado
    const savedIndex = localStorage.getItem('activeIndex');

    if (savedIndex !== null && liItems[savedIndex]) {
        liItems.forEach(li => li.classList.remove('active'));
        liItems[savedIndex].classList.add('active');

        // Actualizamos la posición del indicador
        indicador.style.transform = `translateX(calc(70px * ${savedIndex}))`;
    }

    liItems.forEach((item, index) => {
        item.addEventListener('click', function (e) {
            e.preventDefault(); // Evitamos que el enlace navegue inmediatamente

            // Guardamos el índice
            localStorage.setItem('activeIndex', index);

            // Agregamos un efecto de salida
            document.body.classList.add('fade-out');

            // Esperamos a que termine la animación antes de cambiar de página
            setTimeout(() => {
                const link = item.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
            }, 300); // Tiempo suficiente para la transición (300ms)
        });
    });
});
