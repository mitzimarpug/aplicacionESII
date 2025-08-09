function cargarHistorial() {
  const contenedor = document.getElementById("listaCompletadas");
  contenedor.innerHTML = "";

  const axiosInstance = getAxiosInstance();

  axiosInstance.get("/tareas/completadas")
    .then(res => {
      const tareas = res.data.tareas;

      if (!tareas.length) {
        contenedor.innerHTML = "<p>No hay tareas completadas aún.</p>";
        return;
      }

      tareas.forEach(t => {
        const div = document.createElement("div");
        div.className = "card tarea-completada mt-3 p-3";
        div.innerHTML = `
          <h3>${t.nombreTarea}</h3>
          <p><b>Materia:</b> ${t.materia}</p>
          <p><b>Fecha de entrega:</b> ${formatDateTimeLocal12h(t.fechaEntrega)}</p>
          <p><b>Prioridad:</b> ${t.prioridad}</p>
          <p><b>Descripción:</b> ${t.descripcion}</p>
          <span class="badge bg-success">Completada</span>
          <button class="btn btn-danger btn-sm mt-2">Eliminar</button>
        `;

        div.querySelector(".btn-danger").addEventListener("click", () => eliminarTarea(t.nombreTarea));
        contenedor.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = "<p>Error al cargar historial.</p>";
    });
}

document.addEventListener("DOMContentLoaded", cargarHistorial);


function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}
