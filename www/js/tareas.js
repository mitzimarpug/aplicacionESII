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
  div.className = "card mt-3 p-3";

  div.innerHTML = `
    <h3>${t.nombreTarea}</h3>
    <p><b>Materia:</b> ${t.materia}</p>
    <p><b>Fecha y hora de entrega:</b> ${formatDateTimeLocal12h(t.fechaEntrega)}</p>


    <p><b>Prioridad:</b> ${t.prioridad}</p>
    <p><b>Descripción:</b> ${t.descripcion}</p>
    ${
      t.completada
        ? '<span class="badge bg-success">Completada</span>'
        : `<button class="btnCompletar btn btn-success btn-sm me-2">Marcar como completada</button>`
    }
    <button class="btnEditar btn btn-primary btn-sm me-2">Editar</button>
    <button class="btn btn-danger btn-sm">Eliminar</button>
  `;

  if (!t.completada) {
    div.querySelector(".btnCompletar").addEventListener("click", () => marcarComoCompletada(t.nombreTarea));
  }
  div.querySelector(".btnEditar").addEventListener("click", () => abrirModalEditar(t));
  div.querySelector(".btn-danger").addEventListener("click", () => eliminarTarea(t.nombreTarea));

  return div;
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

    tareas.forEach(t => contenedor.appendChild(crearTarjetaTarea(t)));
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

async function eliminarTarea(nombreTarea) {
  const confirmacion = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará la tarea permanentemente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  // Solo continuar si el usuario confirma
  if (confirmacion.isConfirmed) {
    const axiosInstance = getAxiosInstance();

    try {
      const res = await axiosInstance.delete(`/tareas/nombreTarea/${encodeURIComponent(nombreTarea)}`);
      Swal.fire("Eliminado", res.data.mensaje || "Tarea eliminada", "success");
      cargarTareas();
      cargarHistorial(); // Recargar lista
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      Swal.fire("Error", "No se pudo eliminar la tarea", "error");
    }
  }
}


