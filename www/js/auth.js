// Login
async function loginUsuario(e) {
  e.preventDefault();
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const res = await axios.post(`${API_URL}/usuarios/login`, {
      correo,
      contrasena,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
    window.location.replace("tareas.html");

  } catch (err) {
    alert("Error al iniciar sesión");
    console.error(err);
  }
}

// Registro
async function registrarUsuario(e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    await axios.post(`${API_URL}/usuarios/registro`, {
      nombre,
      correo,
      contrasena,
    });

    alert("Registro exitoso");
    window.location.href = "login.html";
  } catch (err) {
    alert("Error al registrar usuario");
    console.error(err);
  }
}

// Logout
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}
