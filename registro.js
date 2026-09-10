const formRegistro = document.getElementById("formRegistro");

formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let esValido = true;

    // --- 1. Validar Nombre ---
    const nombre = document.getElementById("nombreReg");
    const errorNombre = document.getElementById("errorNombreReg");
    if (nombre.value.trim() === "") {
        mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
        esValido = false;
    } else {
        limpiarError(nombre, errorNombre);
    }

    // --- 2. Validar Correo ---
    const correo = document.getElementById("correoReg");
    const errorCorreo = document.getElementById("errorCorreoReg");
    const correoValor = correo.value.trim().toLowerCase();
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Cargar usuarios existentes para verificar duplicados
    const usuarios = JSON.parse(localStorage.getItem("usuariosNutriVida")) || [];
    const correoExiste = usuarios.some(u => u.correo.toLowerCase() === correoValor);

    if (correoValor === "") {
        mostrarError(correo, errorCorreo, "El correo electrónico es obligatorio.");
        esValido = false;
    } else if (!patronCorreo.test(correoValor)) {
        mostrarError(correo, errorCorreo, "Ingresa un formato de correo válido.");
        esValido = false;
    } else if (correoExiste) {
        mostrarError(correo, errorCorreo, "Este correo ya se encuentra registrado.");
        esValido = false;
    } else {
        limpiarError(correo, errorCorreo);
    }

    // --- 3. Validar Contraseña ---
    const clave = document.getElementById("claveReg");
    const errorClave = document.getElementById("errorClaveReg");
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

    // --- 4. Validar Confirmación de Contraseña ---
    const claveConf = document.getElementById("claveConf");
    const errorClaveConf = document.getElementById("errorClaveConf");

    if (claveConf.value.trim() === "") {
        mostrarError(claveConf, errorClaveConf, "Debes confirmar tu contraseña.");
        esValido = false;
    } else if (claveConf.value !== claveValor) {
        mostrarError(claveConf, errorClaveConf, "Las contraseñas no coinciden.");
        esValido = false;
    } else {
        limpiarError(claveConf, errorClaveConf);
    }

    // --- 5. Guardar y Redirigir ---
    if (esValido) {
        const nuevoUsuario = {
            nombre: nombre.value.trim(),
            correo: correoValor,
            clave: claveValor
        };

        // Agregar al arreglo y guardar en localStorage
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuariosNutriVida", JSON.stringify(usuarios));

        // Redirigir al login
        alert("¡Registro exitoso! Ahora puedes iniciar sesión."); // Feedback simple para el usuario
        window.location.href = "login.html"; // Asegúrate de que tu archivo de login se llame así
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