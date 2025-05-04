document.addEventListener("DOMContentLoaded", function() {
    const options= document.querySelectorAll(".option");

    options.forEach(option => {
        option.addEventListener("click", function() {
            option.classList.toggle("selected");
        });
    });
});
