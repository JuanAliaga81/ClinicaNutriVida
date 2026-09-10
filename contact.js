const form = document.getElementById("formContacto");

form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita que la página se recargue

    let esValido = true;

    // --- Validar Nombre ---
    const nombre = document.getElementById("nombre");
    const errorNombre = document.getElementById("errorNombre");

    if (nombre.value.trim() === "") {
        mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
        esValido = false;
    } else if (nombre.value.length > 100) {
        mostrarError(nombre, errorNombre, "El nombre no puede superar los 100 caracteres.");
        esValido = false;
    } else {
        limpiarError(nombre);
    }

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

    // --- Validar Mensaje ---
    const mensaje = document.getElementById("mensaje");
    const errorMensaje = document.getElementById("errorMensaje");

    if (mensaje.value.trim() === "") {
        mostrarError(mensaje, errorMensaje, "El mensaje es obligatorio.");
        esValido = false;
    } else if (mensaje.value.length > 500) {
        mostrarError(mensaje, errorMensaje, "El mensaje no puede superar los 500 caracteres.");
        esValido = false;
    } else {
        limpiarError(mensaje);
    }

    // --- Si todo está bien, mostramos el mensaje de éxito ---
    if (esValido) {
        document.getElementById("exito").classList.remove("d-none");
        form.reset();
        form.classList.remove("was-validated");
    }
});

// Funciones de apoyo para mostrar/limpiar errores visualmente
function mostrarError(campo, elementoError, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    elementoError.textContent = mensaje;
}

function limpiarError(campo) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
}