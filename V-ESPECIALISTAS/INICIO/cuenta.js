const fileInput = document.getElementById("file-input");
        const displayedImage = document.getElementById("displayed-image");
        const uploadBtn = document.getElementById("upload-btn");

        // Evento para abrir el selector de archivos
        uploadBtn.addEventListener("click", () => {
            fileInput.click();
        });

        // Evento para cambiar la imagen cuando el usuario seleccione un archivo
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0]; // Obtener el archivo seleccionado

            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    displayedImage.src = e.target.result; // Mostrar la imagen seleccionada
                };

                reader.readAsDataURL(file);
            }
        });