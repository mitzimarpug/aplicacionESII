function cargarHistorial() {
  const contenedor = document.getElementById("listaCompletadas");
  contenedor.innerHTML = '<div class="loading">Cargando historial...</div>';
  contenedor.innerHTML = "";

  const axiosInstance = getAxiosInstance();

  axiosInstance.get("/tareas/completadas")
    .then(res => {
      const tareas = res.data.tareas;

      if (!tareas.length) {
        contenedor.innerHTML = `
          <div class="empty-state">
            <img src="img/empty.svg" alt="Sin tareas" width="150">
            <p>No hay tareas completadas aún</p>
            <a href="tareas.html" class="btn btn-primary">Ir a tareas</a>
          </div>
        `;
        return;
      }

      tareas.forEach(t => {
        const fechaCompletada = t.fechaCompletada ? formatDateTimeLocal12h(t.fechaCompletada) : "Fecha no registrada";

        const div = document.createElement("div");
        div.className = "card tarea-completada";
        div.innerHTML = `
          <div class="card-header">
            <h3>${t.nombreTarea}</h3>
            <span class="badge bg-success">✓ Completada</span>
          </div>
          <div class="card-body">
            <p><strong>📚 Materia:</strong> ${t.materia}</p>
            <p><strong>⏰ Fecha de entrega:</strong> ${formatDateTimeLocal12h(t.fechaEntrega)}</p>
            <p><strong>✅ Completada el:</strong> ${fechaCompletada}</p>
            <p><strong>⚠️ Prioridad:</strong> ${t.prioridad}</p>
            <p><strong>📝 Descripción:</strong> ${t.descripcion || 'Sin descripción'}</p>
            <button class="btn btn-danger btn-eliminar">🗑️ Eliminar del historial</button>
          </div>
        `;

        div.querySelector(".btn-eliminar").addEventListener("click", (e) => {
          e.stopPropagation();
          eliminarTarea(t.nombreTarea); 
        });
        contenedor.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = `
        <div class="error-state">
          <p>Error al cargar el historial</p>
          <button class="btn btn-retry" onclick="cargarHistorial()">
            🔄 Reintentar
          </button>
        </div>
      `;
    });
}

// Función para formatear fechas
function formatDateTimeLocal12h(dateString) {
  if (!dateString) return "Fecha no disponible";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Fecha inválida";

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convertir 0 a 12
  
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

async function eliminarTarea(nombreTarea) {
  const confirmacion = await Swal.fire({
    title: '¿Eliminar tarea?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#95a5a6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  // Solo continuar si el usuario confirma
  if (confirmacion.isConfirmed) {
    const axiosInstance = getAxiosInstance();

    try {
      const res = await axiosInstance.delete(`/tareas/nombreTarea/${encodeURIComponent(nombreTarea)}`);
      Swal.fire('¡Eliminada!', 'La tarea fue removida del historial', res.data.mensaje || 'success');
      
      cargarHistorial();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      Swal.fire("Error", "No se pudo eliminar la tarea", "error");
    }
  }
}

document.addEventListener("DOMContentLoaded", cargarHistorial);


function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}
