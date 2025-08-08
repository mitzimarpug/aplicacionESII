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
  document.getElementById("modalFecha").value = tarea.fechaEntrega.split("T")[0];
  document.getElementById("modalHora").value = tarea.fechaEntrega.split("T")[0];
  document.getElementById("modalPrioridad").value = tarea.prioridad;
  document.getElementById("modalDescripcion").value = tarea.descripcion;
  document.getElementById("modalTarea").style.display = "block";

  const form = document.getElementById("formModalTarea");
  form.onsubmit = async function (e) {
    e.preventDefault();

    const body = {
      nombreTarea: document.getElementById("modalNombre").value,
      materia: document.getElementById("modalMateria").value,
      fechaEntrega: document.getElementById("modalFecha").value,
      horaEntrega: document.getElementById("modalHora").value,
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
  const horaEntrega = document.getElementById("modalHora").value;
  const prioridad = document.getElementById("modalPrioridad").value;
  const descripcion = document.getElementById("modalDescripcion").value;

  if (!fechaEntrega || !horaEntrega) {
    Swal.fire("Error", "Debes ingresar fecha y hora de entrega", "warning");
    return;
  }

  try {
    const axiosInstance = getAxiosInstance();
    await axiosInstance.post('/tareas', {
      nombreTarea,
      materia,
      fechaEntrega,
      horaEntrega,
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
