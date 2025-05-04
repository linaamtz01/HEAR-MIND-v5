
  const campanaBtn = document.getElementById('campanitaBtn');
  const popup = document.getElementById('popupNotificaciones');

  campanaBtn.addEventListener('click', () => {
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  });

  // Opcional: cerrar el popup al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (!popup.contains(event.target) && !campanaBtn.contains(event.target)) {
      popup.style.display = 'none';
    }
  });

