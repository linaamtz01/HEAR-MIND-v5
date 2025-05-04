document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-login');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Evita que la página se recargue
  
      const usuario = document.getElementById('usuario').value.trim();
      const contraseña = document.getElementById('contraseña').value.trim();
      const tipoUsuario = localStorage.getItem('tipoUsuario'); // paciente o especialista
  
      // Validación de ejemplo (aquí pondrás tu login real después)
      if (usuario === "sofiagonzales" && contraseña === "1234") {
        if (tipoUsuario === "paciente") {
          window.location.href = "V-PACIENTES/IS Y REGISTRO/enfoque.html"; // Página para paciente
        } else if (tipoUsuario === "especialista") {
          window.location.href = "V-ESPECIALISTAS/INICIO/inicioEspecia.html"; // Página para especialista
        } 
      } else {
        mostrarToast('Usuario o contraseña incorrectos');
      }
    });
  
    // Esto es para mostrar en consola qué tipo seleccionó
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (tipoUsuario === 'paciente') {
      console.log('Modo paciente seleccionado');
    } else if (tipoUsuario === 'especialista') {
      console.log('Modo especialista seleccionado');
    }
  });
  
  // Esta función se llama al cambiar el toggle paciente/especialista
  function seleccionarUsuario(tipo) {
    localStorage.setItem('tipoUsuario', tipo);
    console.log("Seleccionaste: " + tipo);
  }
  
  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = "toast";
    }, 3000); // Se esconde en 3 segundos
  }