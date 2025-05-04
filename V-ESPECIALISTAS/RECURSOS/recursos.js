document.addEventListener('DOMContentLoaded', function () {
    const liItems = document.querySelectorAll('.menu .list');
    const indicador = document.querySelector('.indicador');

    const savedIndex = localStorage.getItem('activeIndex');

    if (savedIndex !== null && liItems[savedIndex]) {
        liItems.forEach(li => li.classList.remove('active'));
        liItems[savedIndex].classList.add('active');

        indicador.style.transition = 'none';
        indicador.style.transform = `translateX(calc(70px * ${savedIndex}))`;

        setTimeout(() => {
            indicador.style.transition = 'transform 0.4s ease, background-color 0.3s ease';
        }, 50);
    }

    liItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            localStorage.setItem('activeIndex', index);
        });
    });
});
