// Abrir modal vacío
function abrirModalAgregar() {
  document.getElementById("modalTitulo").textContent = "Agregar Tarea";
  document.getElementById("formModalTarea").reset();
  document.getElementById("modalTarea").style.display = "block";

  // Remover listener previo
  const form = document.getElementById("formModalTarea");
  form.onsubmit = async function (e) {
    e.preventDefault();
    await agregarDesdeModal();
  };
}


function abrirModalEditar(tarea) {
  document.getElementById("modalTitulo").textContent = "Editar Tarea";
  document.getElementById("modalNombre").value = tarea.nombreTarea;
  document.getElementById("modalMateria").value = tarea.materia;

  // Ajustar fecha y hora para datetime-local (zona local)
  const fecha = new Date(tarea.fechaEntrega);
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  document.getElementById("modalFechaHora").value = fecha.toISOString().slice(0,16);

  document.getElementById("modalPrioridad").value = tarea.prioridad;
  document.getElementById("modalDescripcion").value = tarea.descripcion;

  const modal = document.getElementById("modalTarea");
  modal.style.display = "flex";

  const form = document.getElementById("formModalTarea");
  form.onsubmit = async function (e) {
    e.preventDefault();

    const fechaHoraLocal = document.getElementById("modalFechaHora").value;
    const fechaUTC = new Date(fechaHoraLocal);

    const body = {
      nombreTarea: document.getElementById("modalNombre").value,
      materia: document.getElementById("modalMateria").value,
      fechaEntrega: fechaUTC.toISOString(),
      prioridad: document.getElementById("modalPrioridad").value,
      descripcion: document.getElementById("modalDescripcion").value,
    };

    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/tareas/nombreTarea/${tarea.nombreTarea}`, body);
      Swal.fire("Tarea actualizada", "", "success");
      cerrarModal();
      cargarTareas();
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };
}


function cerrarModal() {
  document.getElementById("modalTarea").style.display = "none";
}

// Agregar tarea desde modal
async function agregarDesdeModal() {
  const nombreTarea = document.getElementById("modalNombre").value;
  const materia = document.getElementById("modalMateria").value;
  const fechaEntrega = document.getElementById("modalFecha").value;
  const prioridad = document.getElementById("modalPrioridad").value;
  const descripcion = document.getElementById("modalDescripcion").value;

  console.log("Fecha desde modal:", fechaEntrega);
  try {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.post('/tareas', {
      nombreTarea,
      materia,
      fechaEntrega,
      prioridad,
      descripcion
    });

    Swal.fire("Tarea agregada correctamente", "", "success");
    cerrarModal();
    cargarTareas();
  } catch (error) {
    Swal.fire("Error", error.response?.data?.mensaje || "Error desconocido", "error");
  }
}
