const form = document.getElementById("formAgendar");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let esValido = true;

    // 1. Validación Nombre
    const nombre = document.getElementById("nombre");
    const errorNombre = document.getElementById("errorNombre");
    if (nombre.value.trim() === "") {
        mostrarError(nombre, errorNombre, "El nombre es obligatorio.");
        esValido = false;
    } else if (nombre.value.trim().length > 100) {
        mostrarError(nombre, errorNombre, "El nombre no puede superar los 100 caracteres.");
        esValido = false;
    } else {
        limpiarError(nombre, errorNombre);
    }

    // 2. Validación RUT (Formato y Algoritmo Módulo 11)
    const rut = document.getElementById("rut");
    const errorRut = document.getElementById("errorRut");
    const rutLimpio = rut.value.trim().toUpperCase();

    if (rutLimpio === "") {
        mostrarError(rut, errorRut, "El RUT es obligatorio.");
        esValido = false;
    } else if (rutLimpio.length < 7 || rutLimpio.length > 9) {
        mostrarError(rut, errorRut, "El RUT debe tener entre 7 y 9 caracteres, sin puntos ni guión.");
        esValido = false;
    } else if (!validarRut(rutLimpio)) {
        mostrarError(rut, errorRut, "El RUT ingresado no es válido.");
        esValido = false;
    } else {
        limpiarError(rut, errorRut);
    }

    // 3. Validación Correo (Acepta Gmail, Outlook, Duoc y cualquier dominio estándar)
    const correo = document.getElementById("correo");
    const errorCorreo = document.getElementById("errorCorreo");
    const correoValor = correo.value.trim();
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (correoValor === "") {
        mostrarError(correo, errorCorreo, "El correo electrónico es obligatorio.");
        esValido = false;
    } else if (!patronCorreo.test(correoValor)) {
        mostrarError(correo, errorCorreo, "Ingresa un correo electrónico válido (ej: usuario@gmail.com o usuario@outlook.com).");
        esValido = false;
    } else {
        limpiarError(correo, errorCorreo);
    }

    // 4. Validación Teléfono (9 dígitos comenzando con 9)
    const telefono = document.getElementById("telefono");
    const errorTelefono = document.getElementById("errorTelefono");
    const telefonoLimpio = telefono.value.replace(/[\s\-\.]/g, "");
    const telefonoValido = /^9\d{8}$/.test(telefonoLimpio);

    if (telefono.value.trim() === "") {
        mostrarError(telefono, errorTelefono, "El teléfono es obligatorio.");
        esValido = false;
    } else if (!telefonoValido) {
        mostrarError(telefono, errorTelefono, "Ingresa un número válido de 9 dígitos (ej: 9 1234 5678).");
        esValido = false;
    } else {
        limpiarError(telefono, errorTelefono);
    }

    // 5. Validación Servicio
    const servicio = document.getElementById("servicio");
    const errorServicio = document.getElementById("errorServicio");
    if (servicio.value === "") {
        mostrarError(servicio, errorServicio, "Selecciona un servicio.");
        esValido = false;
    } else {
        limpiarError(servicio, errorServicio);
    }

    // 6. Validación Fecha
    const fecha = document.getElementById("fecha");
    const errorFecha = document.getElementById("errorFecha");
    const hoy = new Date().toISOString().split("T")[0];

    if (fecha.value === "") {
        mostrarError(fecha, errorFecha, "Selecciona una fecha tentativa.");
        esValido = false;
    } else if (fecha.value < hoy) {
        mostrarError(fecha, errorFecha, "La fecha no puede ser anterior a hoy.");
        esValido = false;
    } else {
        limpiarError(fecha, errorFecha);
    }

    // Procesamiento y guardado si todo es correcto
    if (esValido) {
        const nuevaCita = {
            id: Date.now(),
            nombre: nombre.value.trim(),
            rut: rutLimpio,
            correo: correoValor,
            telefono: "+56 " + telefonoLimpio,
            servicio: servicio.options[servicio.selectedIndex].text,
            fecha: fecha.value,
            fechaRegistro: new Date().toLocaleDateString("es-CL")
        };

        // Guardar acumulativamente en localStorage para la página citas.html
        const citasGuardadas = JSON.parse(localStorage.getItem("citasNutriVida")) || [];
        citasGuardadas.push(nuevaCita);
        localStorage.setItem("citasNutriVida", JSON.stringify(citasGuardadas));

        // Guardar la cita actual en sessionStorage para confirmacion.html
        sessionStorage.setItem("reservaNutriVida", JSON.stringify(nuevaCita));

        // Redirección
        window.location.href = "confirmacion.html";
    }
});

// Validación de RUT chileno (algoritmo Módulo 11)
function validarRut(rut) {
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = suma % 11;
    const dvEsperado = 11 - resto;

    let dvCalculado;
    if (dvEsperado === 11) dvCalculado = "0";
    else if (dvEsperado === 10) dvCalculado = "K";
    else dvCalculado = dvEsperado.toString();

    return dv === dvCalculado;
}

// Control visual de clases de error y mensajes Bootstrap
function mostrarError(campo, elementoError, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    if (elementoError) {
        elementoError.textContent = mensaje;
    }
}

function limpiarError(campo, elementoError) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
    if (elementoError) {
        elementoError.textContent = "";
    }
}