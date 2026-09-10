document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar que el usuario haya iniciado sesión
    const sesionActiva = JSON.parse(sessionStorage.getItem("usuarioSesion"));
    
    // Si no hay sesión, se le expulsa inmediatamente al login
    if (!sesionActiva) {
        window.location.href = "login.html";
        return;
    }

    // 2. Obtener los datos completos del usuario desde localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuariosNutriVida")) || [];
    const usuarioCompleto = usuarios.find(u => u.correo.toLowerCase() === sesionActiva.correo.toLowerCase());

    // Si por alguna razón el usuario se borró de la BD local, destruir sesión
    if (!usuarioCompleto) {
        sessionStorage.removeItem("usuarioSesion");
        window.location.href = "login.html";
        return;
    }

    // 3. Imprimir datos en la tarjeta de perfil
    // Nota: Si el usuario es el de prueba, le asignamos un nombre genérico porque no lo pedimos en el login
    document.getElementById("perfilNombre").textContent = usuarioCompleto.nombre || "Usuario Paciente";
    document.getElementById("perfilCorreo").textContent = usuarioCompleto.correo;

    // 4. Buscar y mostrar las citas de este usuario
    const todasLasCitas = JSON.parse(localStorage.getItem("citasNutriVida")) || [];
    // Filtramos para que solo vea las citas donde el correo coincida con el suyo
    const misCitas = todasLasCitas.filter(cita => cita.correo.toLowerCase() === usuarioCompleto.correo.toLowerCase());

    const tablaBody = document.getElementById("tablaMisCitas");
    const mensajeSinCitas = document.getElementById("mensajeSinCitas");

    if (misCitas.length === 0) {
        // Ocultar tabla y mostrar mensaje vacío
        tablaBody.closest("table").classList.add("d-none");
        mensajeSinCitas.classList.remove("d-none");
    } else {
        // Mostrar tabla y ocultar mensaje
        tablaBody.closest("table").classList.remove("d-none");
        mensajeSinCitas.classList.add("d-none");

        // Llenar las filas de la tabla
        misCitas.forEach(cita => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="badge bg-success-subtle text-success border border-success-subtle">${cita.servicio}</span></td>
                <td><strong>${cita.fecha}</strong></td>
                <td>${cita.telefono}</td>
            `;
            tablaBody.appendChild(tr);
        });
    }

    // 5. Configurar el botón de Cerrar Sesión
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    btnCerrarSesion.addEventListener("click", () => {
        sessionStorage.removeItem("usuarioSesion");
        window.location.href = "home.html"; // Redirige al inicio público al cerrar sesión
    });
});