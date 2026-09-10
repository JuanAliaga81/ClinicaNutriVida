const form = document.getElementById("formLogin");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let esValido = true;

    // --- Validar Correo ---
    const correo = document.getElementById("correo");
    const errorCorreo = document.getElementById("errorCorreo");
    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const correoValido = dominiosPermitidos.some(dominio => correo.value.endsWith(dominio));

    if (correo.value.trim() === "") {
        mostrarError(correo, errorCorreo, "El correo es obligatorio.");
        esValido = false;
    } else if (correo.value.length > 100) {
        mostrarError(correo, errorCorreo, "El correo no puede superar los 100 caracteres.");
        esValido = false;
    } else if (!correoValido) {
        mostrarError(correo, errorCorreo, "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
        esValido = false;
    } else {
        limpiarError(correo);
    }

    // --- Validar Contraseña ---
    const clave = document.getElementById("clave");
    const errorClave = document.getElementById("errorClave");

    if (clave.value.trim() === "") {
        mostrarError(clave, errorClave, "La contraseña es obligatoria.");
        esValido = false;
    } else if (clave.value.length < 4 || clave.value.length > 10) {
        mostrarError(clave, errorClave, "La contraseña debe tener entre 4 y 10 caracteres.");
        esValido = false;
    } else {
        limpiarError(clave);
    }

    // --- Si todo está bien, redirige al Home ---
    if (esValido) {
        window.location.href = "home.html";
    }
});

function mostrarError(campo, elementoError, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    elementoError.textContent = mensaje;
}

function limpiarError(campo) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
}