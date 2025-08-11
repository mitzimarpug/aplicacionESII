// Cargar datos del usuario al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosPerfil();
});

function cargarDatosPerfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "Usuario",
    avatar: "img/avatar-default.png"
  };

  document.querySelectorAll('.profile-pic, .nav-profile-pic').forEach(img => {
    img.src = usuario.avatar || "img/avatar-default.png";
  });
  
  document.getElementById('navUsername').textContent = usuario.nombre;
}


// Redirección al hacer clic en la imagen de perfil
document.getElementById('profilePic').addEventListener('click', () => {
  window.location.href = 'configuracion.html';
});

const navToggle = document.getElementById('nav-toggle');

  navToggle.addEventListener('change', () => {
    if (navToggle.checked) {
      document.body.classList.add('no-scroll'); // Bloquea scroll
    } else {
      document.body.classList.remove('no-scroll'); // Permite scroll
    }
  });