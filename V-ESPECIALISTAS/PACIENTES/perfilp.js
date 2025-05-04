
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script cargado correctamente");

  // === EMAIL ===
  const correo = "karensofrr@gmail.com";
  const nombre = "Sofia Gonzales Lopez";
  const asunto = "Consulta de seguimiento";

  const cuerpo = `Hola ${nombre},

Quería hacerte seguimiento a tu progreso. ¿Podemos agendar una nueva cita?

Saludos.`;

  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(correo)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  const linkCorreo = document.getElementById("correoPaciente");

  if (linkCorreo) {
    linkCorreo.href = gmailURL;
    linkCorreo.target = "_blank";
    console.log("✅ Enlace generado:", gmailURL);
  } else {
    console.error("❌ No se encontró el elemento con ID 'correoPaciente'");
  }

  // === RADIO BUTTON TOGGLE ===
  const radioPrograma = document.getElementById("programa");
  const radioSeguimiento = document.getElementById("seguimiento");
  const contPrograma = document.getElementById("programa-content");
  const contSeguimiento = document.getElementById("seguimiento-content");

  radioPrograma.addEventListener("change", () => {
    contPrograma.style.display = "block";
    contSeguimiento.style.display = "none";
  });

  radioSeguimiento.addEventListener("change", () => {
    contPrograma.style.display = "none";
    contSeguimiento.style.display = "block";
  });

  // === FILE UPLOAD ===
  const fileInput = document.getElementById("file-input");
  const uploadBtn = document.getElementById("upload-btn");

  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });
  }

  // === MODAL para citas programadas ===
  const modal = document.getElementById('modal');
  const closeModalBtn = document.querySelector('.close-btn');
  const cardsCitasProgramadas = document.querySelectorAll('.card.cita-programada');

  cardsCitasProgramadas.forEach(card => {
    card.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
