function formatDateTimeLocal12h(dateString) {
  if (!dateString) return "Fecha no disponible";
  const d = new Date(dateString);
  if (isNaN(d)) return "Fecha inválida";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}


function crearTarjetaTarea(t) {
  const div = document.createElement("div");
  div.className = `card ${getPrioridadClass(t.prioridad)}`;
  div.style.cursor = "pointer";
  
  const fechaEntrega = t.fechaEntrega ? formatDateTimeLocal12h(t.fechaEntrega) : "Sin fecha";
  const estadoBadge = t.completada 
    ? '<span class="badge bg-success">✓ Completada</span>'
    : '';
    
  const botonCompletar = t.completada 
    ? ''
    : `<button class="btn btn-success btn-sm me-2 btnCompletar">
         <span class="completar-icon">✓</span> Completar
       </button>`;

  // Contenido inicial (solo visible al principio)
  div.innerHTML = `
    <div class="card-header">
      <h3>${t.nombreTarea}</h3>
      ${estadoBadge}
    </div>
    <div class="card-body">
      <div class="botones-iniciales">
        ${botonCompletar}
        <button class="btn btn-primary btn-sm me-2 btnEditar">✏️ Editar</button>
      </div>
      
      <!-- Detalles ocultos inicialmente -->
      <div class="detalle-tarea" style="display: none;">
        <p><strong>📚 Materia:</strong> ${t.materia}</p>
        <p><strong>⏰ Fecha:</strong> ${fechaEntrega}</p>
        <p><strong>⚠️ Prioridad:</strong> ${t.prioridad}</p>
        <p><strong>📝 Descripción:</strong> ${t.descripcion || 'Sin descripción'}</p>
      </div>
    </div>
  `;

  // Evento para mostrar/ocultar detalles al hacer clic en la tarjeta
  div.addEventListener("click", (e) => {
    // Evitar que se dispare si se hace clic en un botón
    if (e.target.tagName === 'BUTTON') return;
    
    const detalle = div.querySelector(".detalle-tarea");
    detalle.style.display = detalle.style.display === "none" ? "block" : "none";
  });

  // Eventos de botones
  if (!t.completada) {
    div.querySelector(".btnCompletar").addEventListener("click", (e) => {
      e.stopPropagation();
      marcarComoCompletada(t.nombreTarea);
    });
  }

  div.querySelector(".btnEditar").addEventListener("click", (e) => {
    e.stopPropagation();
    abrirModalEditar(t);
  });

  return div;
}

function getPrioridadClass(prioridad) {
  switch(prioridad.toLowerCase()) {
    case 'alta': return 'prioridad-alta';
    case 'media': return 'prioridad-media';
    case 'baja': return 'prioridad-baja';
    default: return '';
  }
}

async function cargarTareas(filtroCampo = "", filtroValor = "", orden = "") {
  const contenedor = document.getElementById("listaTareas");
  contenedor.innerHTML = "";

  const axiosInstance = getAxiosInstance();

  try {
    let url = "/tareas?completada=false"; // 🔹 solo tareas NO completadas

    if (filtroCampo && filtroValor) {
      url += `&${filtroCampo}=${encodeURIComponent(filtroValor)}`;
    } else if (orden) {
      url += `&orden=${orden}`;
    }

    const res = await axiosInstance.get(url);
    const tareas = res.data.tareas;

    if (!tareas.length) {
      contenedor.innerHTML = "<p>No hay tareas que coincidan con tu búsqueda.</p>";
      return;
    }

    tareas.forEach(t => contenedor.prepend(crearTarjetaTarea(t)));

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error al cargar tareas.</p>";
  }
}


function marcarComoCompletada(nombreTarea) {
  const axiosInstance = getAxiosInstance();

  axiosInstance.put(`/tareas/completar/${encodeURIComponent(nombreTarea)}`)
    .then(res => {
      alert(res.data.mensaje);
      cargarTareas(); // refrescar la lista
    })
    .catch(err => {
      console.error(err);
      alert("Error al marcar tarea como completada");
    });
}

// Función para mostrar/ocultar filtros
function toggleFilters() {
  const panel = document.getElementById('filtersPanel');
  panel.classList.toggle('show');
}

function cambiarPlaceholder() {
  const campo = document.getElementById("filtroCampo").value;
  const input = document.getElementById("filtroValor");

  switch (campo) {
    case "nombreTarea":
      input.placeholder = "Buscar por nombre...";
      break;
    case "materia":
      input.placeholder = "Buscar por materia...";
      break;
    case "prioridad":
      input.placeholder = "Buscar por prioridad (Alta, Media, Baja)...";
      break;
  }

  input.value = "";
}

function aplicarFiltros() {
  const campo = document.getElementById("filtroCampo").value;
  const valor = document.getElementById("filtroValor").value.trim();
  const orden = document.getElementById("ordenarPor").value;

  cargarTareas(campo, valor, orden);
}




