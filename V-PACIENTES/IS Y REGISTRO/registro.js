document.getElementById('formRegistro').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar envío automático

    verificarEdad();
});

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function verificarEdad() {
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    if (!fechaNacimiento) {
        mostrarToast('Por favor, ingresa tu fecha de nacimiento.');
        return;
    }

    const edad = calcularEdad(fechaNacimiento);

    if (edad < 12) {
        // Si es menor de 12, redirigir al registro de menores
        localStorage.setItem('fechaNacimiento', fechaNacimiento);
        window.location.href = 'reg-menor.html';
    } else {
        // Si tiene 12 años o más, redirigir al inicio de sesión
        mostrarToast('Redirigiendo al inicio de sesión...');
        setTimeout(() => {
            window.location.href = 'inicio.html'; // <-- Cambia aquí el nombre si tu login se llama diferente
        }, 2000); // Espera 2 segundos para que el usuario vea el toast
    }
}

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = "toast";
    }, 3000);
}
