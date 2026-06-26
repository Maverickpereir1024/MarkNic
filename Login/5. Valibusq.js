function validarYEnviar() {
    // 1. Obtenemos los elementos
    const inputCargo = document.getElementById('cargo');
    const inputLugar = document.getElementById('lugar');

    // 2. Extraemos los valores y quitamos espacios en blanco
    const cargo = inputCargo.value.trim();
    const lugar = inputLugar.value.trim();

    console.log("Intentando buscar:", cargo, lugar); // Esto es para probar

    // 3. Validamos
    if (cargo === "" || lugar === "") {
        alert("¡Error! Debes completar ambos campos para continuar.");
        
        // Opcional: ponerle un borde rojo al que esté vacío
        if(cargo === "") inputCargo.style.border = "2px solid red";
        if(lugar === "") inputLugar.style.border = "2px solid red";
        
    } else {
        // 4. Si todo está bien, redirigimos
        // IMPORTANTE: Verifica que esta ruta sea la correcta desde tu index.html
        window.location.href = "/Inicio/1. indexmenu.html";
    }
}


// ==========================================
// GEOLOCALIZACIÓN DEL USUARIO
// ==========================================

function obtenerUbicacion() {
    const inputCiudad = document.getElementById('lugar');
    inputCiudad.value = "Buscando ubicación..."; // Mensaje temporal

    // Verificamos si el navegador del celular soporta GPS
    if (navigator.geolocation) {
        // Esto lanza la ventanita del navegador pidiendo permiso
        navigator.geolocation.getCurrentPosition(ubicacionExitosa, ubicacionError);
    } else {
        alert("Tu navegador no soporta geolocalización.");
        inputCiudad.value = "";
    }
}

// Si el usuario le da a "Permitir"
async function ubicacionExitosa(posicion) {
    const lat = posicion.coords.latitude;
    const lon = posicion.coords.longitude;

    try {
        // Usamos una API gratuita para traducir lat/lon a una dirección real
        const respuesta = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const datos = await respuesta.json();

        // En Nicaragua, OpenStreetMap suele guardar el departamento en "state"
        let departamento = datos.address.state || datos.address.city;

        // Limpiamos un poco el texto por si la API devuelve "Departamento de Managua"
        if (departamento.includes("Departamento de")) {
            departamento = departamento.replace("Departamento de ", "");
        }

        // Colocamos el resultado en el input
        document.getElementById('lugar').value = departamento;

    } catch (error) {
        console.error("Error al traducir las coordenadas:", error);
        document.getElementById('lugar').value = "";
        alert("No pudimos traducir tu ubicación. Por favor, escríbela manualmente.");
    }
}

// Si el usuario le da a "Bloquear" o hay un error
function ubicacionError(error) {
    const inputCiudad = document.getElementById('lugar');
    inputCiudad.value = ""; // Limpiamos el mensaje temporal
    
    if (error.code === 1) {
        alert("Denegaste el acceso a la ubicación. Puedes escribir tu departamento manualmente.");
    } else {
        alert("No se pudo obtener tu ubicación actual. Intenta escribiéndola.");
    }
}

// ==========================================
// AUTOCOMPLETADO PERSONALIZADO (A prueba de iPhone)
// ==========================================

// Guardamos los departamentos en un arreglo de JS
const departamentosNica = [
    "Boaco", "Carazo", "Chinandega", "Chontales", "Estelí",
    "Granada", "Jinotega", "León", "Madriz", "Managua",
    "Masaya", "Matagalpa", "Nueva Segovia", "Rivas",
    "Río San Juan", "Costa Caribe Norte", "Costa Caribe Sur"
];

function filtrarDepartamentos() {
    const input = document.getElementById('lugar');
    const filtro = input.value.toLowerCase();
    const listaSugerencias = document.getElementById('sugerencias-lista');

    // Limpiamos la lista previa
    listaSugerencias.innerHTML = '';

    // Si el usuario borró todo y el input está vacío, escondemos la lista
    if (filtro === '') {
        listaSugerencias.style.display = 'none';
        return;
    }

    // Buscamos cuáles departamentos coinciden con lo que escribió
    const filtrados = departamentosNica.filter(dep => dep.toLowerCase().includes(filtro));

    // Si hay coincidencias, las mostramos
    if (filtrados.length > 0) {
        listaSugerencias.style.display = 'block'; // Mostramos la caja flotante
        
        filtrados.forEach(dep => {
            const li = document.createElement('li');
            li.textContent = dep;
            li.style.padding = '12px 15px';
            li.style.cursor = 'pointer';
            li.style.borderBottom = '1px solid #f8fafc';
            li.style.color = '#333';
            li.style.fontSize = '0.95rem';

            // Cuando el usuario toca una opción en su celular
            li.onclick = function() {
                input.value = dep; // Rellenamos el input con la ciudad elegida
                listaSugerencias.style.display = 'none'; // Escondemos la lista
            };

            listaSugerencias.appendChild(li);
        });
    } else {
        // Si escribe algo que no existe, escondemos la lista
        listaSugerencias.style.display = 'none';
    }
}

// Truco extra: Si toca cualquier otra parte de la pantalla, se cierra la lista
document.addEventListener('click', function(e) {
    if(e.target.id !== 'lugar') {
        document.getElementById('sugerencias-lista').style.display = 'none';
    }
});