document.addEventListener("DOMContentLoaded", () => {
    const btnAuth = document.getElementById("btnAuth");
    
    // Verifica si el botón existe en la página actual para evitar errores
    if (btnAuth) {
        const sesionActiva = JSON.parse(sessionStorage.getItem("usuarioSesion"));
        
        if (sesionActiva) {
            // Si el usuario ingresó sesión
            btnAuth.textContent = "Mostrar Perfil";
            btnAuth.href = "perfil.html";
            // Opcional: Cambia el estilo para que se vea diferente al estar logueado
            btnAuth.classList.remove("btn-outline-success");
            btnAuth.classList.add("btn-success");
        } else {
            // Si no ha ingresado sesión
            btnAuth.textContent = "Iniciar Sesión";
            btnAuth.href = "login.html";
            btnAuth.classList.remove("btn-success");
            btnAuth.classList.add("btn-outline-success");
        }
    }
});