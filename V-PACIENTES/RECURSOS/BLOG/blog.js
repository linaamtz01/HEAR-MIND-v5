const categorias = document.querySelector(".categorias");

let isDragging = false;
let startX;
let scrollLeft;

categorias.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - categorias.offsetLeft;
    scrollLeft = categorias.scrollLeft;
    categorias.style.cursor = "grabbing";
});

categorias.addEventListener("mouseleave", () => {
    isDragging = false;
    categorias.style.cursor = "grab";
});

categorias.addEventListener("mouseup", () => {
    isDragging = false;
    categorias.style.cursor = "grab";
});

categorias.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categorias.offsetLeft;
    const walk = (x - startX) * 1;
    categorias.scrollLeft = scrollLeft - walk;
});

categorias.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    categorias.scrollLeft += evt.deltaY;
});
