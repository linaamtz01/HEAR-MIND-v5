
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



