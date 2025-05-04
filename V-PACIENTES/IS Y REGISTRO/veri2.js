const inputs = document.querySelectorAll('.input-cod input'); // Corrijo el nombre de la clase

inputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
    if (e.target.value.length > 0 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

function verificarCodigo() {
  let codigo = "";
  inputs.forEach(input => {
    codigo += input.value;
  });

  if (codigo.length === 4) {
    alert("Código ingresado: " + codigo);
    window.location.href = "index.html"; // Redirecciona manualmente
  } else {}
}
