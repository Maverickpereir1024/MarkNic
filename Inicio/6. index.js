// Abre la invitación de entrevista
function openInterviewModal() {
    document.getElementById('interview-modal').style.display = 'flex';
}

function showWarning() {
const warningDiv = document.getElementById('warning-text');
    const modal = document.getElementById('interview-modal');

    // Verificamos si la advertencia ya es visible
    if (warningDiv.style.display === 'none' || warningDiv.style.display === '') {
        
        // PRIMER CLIC: Solo mostramos la advertencia
        warningDiv.style.display = 'block';
        warningDiv.style.animation = 'shake 0.5s ease';
        
        // Opcional: Puedes cambiar el texto del botón a "¿Confirmar?" 
        // para que el usuario sepa que el siguiente clic es el definitivo.
        
    } else {
        // SEGUNDO CLIC: Como la advertencia ya estaba ahí, cerramos el modal
        modal.style.display = 'none';
    }


}

// Ir al lobby de videollamada
function goToLobby() {
    document.getElementById('interview-modal').style.display = 'none';
    document.getElementById('video-lobby').style.display = 'flex';
    requestPermissions(); // Pide permiso de cámara al entrar
}

// Función para pedir cámara y micro al dispositivo sea PC o móvil (Algo parecido a Google Meet)
async function requestPermissions() {
    const preview = document.getElementById('camera-preview');

    try {
        // Pedimos video y audio al dispositivo, esto abrirá la cámara o en celular como su camara frontal por defecto.
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user", // Usa la cámara frontal en móviles
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        });

        // Creamos el elemento de video dinámicamente
        const videoElement = document.createElement('video');

        // Conectamos la cámara al elemento
        videoElement.srcObject = stream;

        // Configuraciones críticas para que se vea de inmediato
        videoElement.autoplay = true;
        videoElement.muted = true; // Silenciamos el preview para evitar eco molesto contigo mismo
        videoElement.playsInline = true;

        // Estilo para que llene el cuadro y parezca un espejo
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover"; // Para que no se vea estirado
        videoElement.style.borderRadius = "12px";
        videoElement.style.transform = "scaleX(-1)"; // Efecto espejo

        // Limpiamos el mensaje de "Cámara apagada" y metemos el video
        preview.innerHTML = '';
        preview.appendChild(videoElement);

        console.log("¡Cámara activada! Ahora deberías ver tu rostro.");

    } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        preview.innerHTML = `
            <div style="color: #ff4d4d; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No pudimos acceder a tu cámara. Revisa los permisos del navegador.</p>
            </div>`;
    }
}

// ==========================================
// CONEXIÓN A SUPABASE (Base de datos)
// ==========================================
const supabaseUrl = 'https://mrretnaghvkipwggktfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycmV0bmFnaHZraXB3Z2drdGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTA0NDgsImV4cCI6MjA5MTc4NjQ0OH0.UF_bhFFP__31GiiTxy2fsaKVqNjGie6H2LdGuAvZmoc';
const clienteSupabase = supabase.createClient(supabaseUrl, supabaseKey);

async function obtenerTrabajos() {
    const contenedor = document.getElementById('lista-vacantes');
    
    if (!contenedor) return; 

    // Reemplazar 'vacantes' por el nombre real de la tabla en Supabase
    const { data, error } = await clienteSupabase
        .from('job_offer') 
        .select('*'); 

        // AGREGA ESTAS DOS LÍNEAS AQUÍ:
    console.log("Datos recibidos de Supabase:", data);
    console.log("Errores de Supabase:", error);

    if (error) {
        console.error('Hubo un error al traer vacantes:', error);
        contenedor.innerHTML = '<p>Error de conexión con el servidor.</p>';
        return;
    }

    // Limpiamos el texto de "Cargando..."
    contenedor.innerHTML = ''; 
    
   // Recorremos los datos y creamos las TARJETAS PEQUEÑAS para el menú
data.forEach(trabajo => {
    contenedor.innerHTML += `
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); position: relative;">
            
            <h3 style="margin: 0 0 10px 0; font-size: 1.25rem; color: #1e293b;">${trabajo.title}</h3>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #4f46e5; font-size: 0.95rem; font-weight: 600;">
                <i class="fas fa-building"></i> 
                <span>${trabajo.description_original}</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px; color: #64748b; font-size: 0.9rem;">
                <i class="fas fa-map-marker-alt"></i> 
                <span>Managua, Nicaragua</span> 
            </div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 15px;">

            <div style="display: flex; justify-content: flex-end;">
                <button 
                    style="background: #2e54a5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: 0.3s;"
                    onclick="window.location.href='/Inicio/7. indexpostularse.html?id=${trabajo.id}'"
                >
                    Ver detalles
                </button>
            </div>
        </div>
    `;
});
}

// Ejecutamos la función apenas cargue el archivo
obtenerTrabajos();



// Datos de prueba (Aqui adriana debemos poner la parte de ramon o sea en vez de "mispostulaciones"
//  el backend FastAPI después)
const misPostulaciones = [
    { puesto: "Ejecutivo de Soporte Tecnico", empresa: "Maverick, S.A.", estado: "revision" },
    { puesto: "Pasantia de Sistemas", empresa: "Castillo Solutions", estado: "contratado" }
];

// Mapeo de estados a números (índices)
const niveles = {
    "recibido": 0,
    "revision": 1,
    "entrevista": 2,
    "contratado": 3,
    "finalizado": 4
};

function renderizarPostulaciones() {
    const contenedor = document.getElementById('lista-postulaciones');
    const template = document.getElementById('template-postulacion');

    misPostulaciones.forEach(postulacion => {
        const clone = template.content.cloneNode(true);
        
        // Rellenar datos básicos
        clone.querySelector('.puesto').textContent = postulacion.puesto;
        clone.querySelector('.empresa').textContent = postulacion.empresa;

        // Lógica del Stepper
        const pasos = clone.querySelectorAll('.step');
        const lineas = clone.querySelectorAll('.line');
        const nivelActual = niveles[postulacion.estado];

        pasos.forEach((paso, index) => {
            if (index <= nivelActual) {
                paso.classList.add('active');
            }
        });

        lineas.forEach((linea, index) => {
            if (index < nivelActual) {
                linea.classList.add('active');
            }
        });

        contenedor.appendChild(clone);
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', renderizarPostulaciones);





//Zona de los filtros
function toggleDropdown(event, id) {
    // Evita que el clic cierre el menú inmediatamente
    event.stopPropagation();

    const dropdown = document.getElementById(id);
    const todos = document.querySelectorAll('.filter-dropdown');

    // Cerrar los otros que estén abiertos
    todos.forEach(d => {
        if (d.id !== id) d.classList.remove('show-dropdown');
    });

    // Alternar el actual
    dropdown.classList.toggle('show-dropdown');
}

// Cerrar si haces clic en cualquier otro lado de la pantalla
document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    dropdowns.forEach(d => {
        if (!d.contains(e.target)) {
            d.classList.remove('show-dropdown');
        }
    });
});



// buscador
function buscarVacantes() {
    // 1. Obtener el texto del buscador y pasarlo a minúsculas
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. Seleccionar todas las tarjetas de trabajo
    let tarjetas = document.getElementsByClassName('job-card');
    let mensajeNoHay = document.getElementById('noResults');
    let contadorEncontrados = 0;

    // 3. Recorrer cada tarjeta
    for (let i = 0; i < tarjetas.length; i++) {
        // Buscamos el texto dentro del strong (título del puesto)
        let titulo = tarjetas[i].getElementsByTagName('h4')[0].innerText.toLowerCase();

        if (titulo.includes(input)) {
            tarjetas[i].style.display = ""; // Mostrar si coincide
            contadorEncontrados++;
        } else {
            tarjetas[i].style.display = "none"; // Ocultar si no coincide
        }
    }

    // 4. Mostrar u ocultar el mensaje de "No hay nada"
    if (contadorEncontrados === 0) {
        mensajeNoHay.style.display = "block";
    } else {
        mensajeNoHay.style.display = "none";
    }
}

// Opcional: Que busque automáticamente mientras escribes
document.getElementById('searchInput').addEventListener('keyup', buscarVacantes);


// ==========================================
// LÓGICA DE LOS FILTROS DESPLEGABLES
// ==========================================

// 1. Función para abrir/cerrar el menú al tocar el botón
function toggleDropdown(event, idDropdown) {
    // Evita que el clic se propague y cierre el menú inmediatamente
    event.stopPropagation(); 
    
    const menu = document.getElementById(idDropdown);
    const estaAbierto = menu.style.display === 'flex';

    // Primero cerramos TODOS los menús para que no se amontonen
    document.querySelectorAll('.filter-dropdown').forEach(el => {
        el.style.display = 'none';
    });

    // Si el menú que tocaste estaba cerrado, lo abrimos
    if (!estaAbierto) {
        menu.style.display = 'flex'; // Usamos flex para que el diseño no se rompa
    }
}

// 2. Si el usuario toca en cualquier otra parte de la pantalla, cerramos los menús
document.addEventListener('click', function(event) {
    // Verificamos si el clic fue AFUERA de un grupo de filtros
    if (!event.target.closest('.filter-group')) {
        document.querySelectorAll('.filter-dropdown').forEach(el => {
            el.style.display = 'none';
        });
    }
});

// 3. LA MAGIA: Cerrar automáticamente al elegir una opción
// Escuchamos todos los checkboxes y radios dentro de los menús
document.querySelectorAll('.filter-dropdown input').forEach(input => {
    input.addEventListener('change', function() {
        
        // Buscamos a qué menú pertenece esta opción
        const menuPadre = this.closest('.filter-dropdown');
        
        if (menuPadre) {
            // Le damos un micro-retraso (200ms) para que el usuario 
            // alcance a ver que sí se marcó la palomita antes de esconderse
            setTimeout(() => {
                menuPadre.style.display = 'none';
            }, 200);
        }
    });
});



