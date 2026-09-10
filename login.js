// Precargar usuario de prueba si aún no existe en el sistema
(function inicializarUsuarioPrueba() {
    const usuarios = JSON.parse(localStorage.getItem("usuariosNutriVida")) || [];
    const existePrueba = usuarios.some(u => u.correo.toLowerCase() === "juanjoaquin@duocuc.cl");

    if (!existePrueba) {
        usuarios.push({
            correo: "juanjoaquin@duocuc.cl",
            clave: "daftpunk"
        });
        localStorage.setItem("usuariosNutriVida", JSON.stringify(usuarios));
    }
})();

const form = document.getElementById("formLogin");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let esValido = true;

    // --- 1. Validar formato de Correo ---
    const correo = document.getElementById("correo");
    const errorCorreo = document.getElementById("errorCorreo");
    const correoValor = correo.value.trim().toLowerCase();
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (correoValor === "") {
        mostrarError(correo, errorCorreo, "El correo electrónico es obligatorio.");
        esValido = false;
    } else if (!patronCorreo.test(correoValor)) {
        mostrarError(correo, errorCorreo, "Ingresa un formato de correo válido (ej: juanjoaquin@duocuc.cl).");
        esValido = false;
    } else {
        limpiarError(correo, errorCorreo);
    }

    // --- 2. Validar formato de Contraseña ---
    const clave = document.getElementById("clave");
    const errorClave = document.getElementById("errorClave");
    const claveValor = clave.value;

    if (claveValor.trim() === "") {
        mostrarError(clave, errorClave, "La contraseña es obligatoria.");
        esValido = false;
    } else if (claveValor.length < 4 || claveValor.length > 10) {
        mostrarError(clave, errorClave, "La contraseña debe tener entre 4 y 10 caracteres.");
        esValido = false;
    } else {
        limpiarError(clave, errorClave);
    }

    // --- 3. Autenticación contra las credenciales ---
    if (esValido) {
        const usuarios = JSON.parse(localStorage.getItem("usuariosNutriVida")) || [];
        const usuarioEncontrado = usuarios.find(
            u => u.correo.toLowerCase() === correoValor && u.clave === claveValor
        );

        if (usuarioEncontrado) {
            // Guardar la sesión activa del usuario
            sessionStorage.setItem("usuarioSesion", JSON.stringify({ correo: usuarioEncontrado.correo }));
            window.location.href = "home.html";
        } else {
            // Error de autenticación (por seguridad se marca la clave o ambos)
            mostrarError(clave, errorClave, "Correo o contraseña incorrectos.");
            mostrarError(correo, errorCorreo, "Verifica tus credenciales.");
        }
    }
});

// Control de estilos Bootstrap para errores
function mostrarError(campo, elementoError, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    if (elementoError) elementoError.textContent = mensaje;
}

function limpiarError(campo, elementoError) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    if (elementoError) elementoError.textContent = "";
}