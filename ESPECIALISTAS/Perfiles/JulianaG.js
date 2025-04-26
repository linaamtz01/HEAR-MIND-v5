document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script cargado correctamente");

  // === EMAIL ===
  const correo = "hearmind7@gmail.com";
  const nombre = "Dr@";
  const asunto = "Consulta de seguimiento";

  const cuerpo = `Hola ${nombre},

  Espero que se encuentre bien.

  Quería comentarle cómo me he sentido estos últimos días.  

  Gracias por su atención.`;


  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(correo)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

  const linkCorreo = document.getElementById("correoEspecialista");

  if (linkCorreo) {
    linkCorreo.href = gmailURL;
    linkCorreo.target = "_blank";
    console.log("✅ Enlace generado:", gmailURL);
  } else {
    console.error("❌ No se encontró el elemento con ID 'correoEspecialista'");
  }
});

const monthTitle = document.getElementById('monthTitle');
const dateList = document.getElementById('dateList');
const prevMonthBtn = document.getElementById('prevMonthBtn');
let currentDate = new Date();

// Guardamos el mes y año actuales para comparar
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function generateDates(date) {
  dateList.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDay = (currentYear === year && currentMonth === month) ? today.getDate() : 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDisplay = new Date(year, month, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  monthTitle.textContent = monthDisplay.charAt(0).toUpperCase() + monthDisplay.slice(1);

  // Activar o desactivar el botón de retroceso
  if (year === currentYear && month === currentMonth) {
    prevMonthBtn.disabled = true;
    prevMonthBtn.style.opacity = "0.4";
    prevMonthBtn.style.cursor = "not-allowed";
  } else {
    prevMonthBtn.disabled = false;
    prevMonthBtn.style.opacity = "1";
    prevMonthBtn.style.cursor = "pointer";
  }

  for (let i = startDay; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const div = document.createElement("div");
    div.className = "date";
    div.dataset.date = d.toISOString();
    div.innerHTML = `${dayNames[d.getDay()]}<br>${i}`;

    div.onclick = () => {
      document.querySelectorAll('.date').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    };

    if (i === startDay) div.classList.add('selected');
    dateList.appendChild(div);
  }
}

function changeMonth(offset) {
  const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset);

  // Si el nuevo mes es anterior al actual, no permitimos el cambio
  if (newDate.getFullYear() < currentYear || (newDate.getFullYear() === currentYear && newDate.getMonth() < currentMonth)) {
    return;
  }

  currentDate = newDate;
  generateDates(currentDate);
}

function bookAppointment() {
  const selectedDate = document.querySelector('.date.selected')?.dataset.date;
  const selectedTime = document.querySelector('.time-slot.selected')?.dataset.time;

  if (selectedDate && selectedTime) {
    const d = new Date(selectedDate);
    const dateFormatted = d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    alert(`Cita agendada para el ${dateFormatted} a las ${selectedTime}`);
  } else {
    alert("Selecciona una fecha y una hora.");
  }
}

document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
  });
});

generateDates(currentDate);
