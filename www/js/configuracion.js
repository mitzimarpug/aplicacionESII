// Cargar datos actuales
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "Usuario",
    avatar: "img/avatar-default.png"
  };
  
  document.getElementById("currentAvatar").src = usuario.avatar;
  document.getElementById("currentUsername").textContent = usuario.nombre;
  
  // Selección de avatar
  document.querySelectorAll(".avatar-option").forEach(avatar => {
    avatar.addEventListener("click", function() {
      document.querySelectorAll(".avatar-option").forEach(a => a.classList.remove("selected"));
      this.classList.add("selected");
      document.getElementById("currentAvatar").src = this.dataset.avatar;
    });
  });
});

function guardarConfiguracion() {
  const selectedAvatar = document.querySelector(".avatar-option.selected")?.dataset.avatar || "img/avatar-default.png";
  
  const usuario = {
    nombre: document.getElementById("currentUsername").textContent,
    avatar: selectedAvatar
  };
  
  localStorage.setItem("usuario", JSON.stringify(usuario));
  Swal.fire("¡Guardado!", "Tus cambios se han guardado", "success").then(() => {
    window.location.href = "tareas.html";
  });
}