document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  const splashLogo = document.getElementById("splash-logo");

  setTimeout(() => {
    splashLogo.classList.add("fade-out");

    setTimeout(() => {
      const token = localStorage.getItem("token");

      if (token) {
        window.location.href = "tareas.html";
      } else {
        window.location.href = "login.html";
      }
    }, 1000); // Espera a que termine la animación (1 segundo)
    
  }, 2000); // Duración del splash inicial (2 segundos)
}
