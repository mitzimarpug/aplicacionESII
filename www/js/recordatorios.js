document.addEventListener('DOMContentLoaded', () => {
    const recordatorioForm = document.getElementById('recordatorioForm');
    const listaRecordatorios = document.getElementById('listaRecordatorios');

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const axiosInstance = getAxiosInstance();

    // Cargar lista al iniciar
    

    // Guardar recordatorio
    recordatorioForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const fecha = document.getElementById('fecha').value;

        axiosInstance.post('/recordatorios', {
            correo: usuario.correo,
            titulo,
            fecha
        })
        .then(res => {
            alert(res.data.mensaje);
            recordatorioForm.reset();
            obtenerRecordatorios();
        })
        .catch(err => {
            console.error(err);
            alert('Error al guardar el recordatorio');
        });
    });

    // Obtener lista
    function obtenerRecordatorios() {
        axiosInstance.get(`/recordatorios/${usuario.correo}`)
            .then(res => {
                listaRecordatorios.innerHTML = '';
                res.data.forEach(rec => {
                    const li = document.createElement('li');
                    li.textContent = `${rec.titulo} - ${new Date(rec.fecha).toLocaleDateString()}`;
                    listaRecordatorios.appendChild(li);
                });
            })
            .catch(err => {
                console.error(err);
                alert('Error al obtener recordatorios');
            });
    }
});
