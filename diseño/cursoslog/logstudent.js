document.addEventListener('DOMContentLoaded', () => {
    // Obtén los datos del usuario y del curso del localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const idUsuario = localStorage.getItem('idUsuario');
    const nombreCurso = localStorage.getItem('cursoNombre');
    const cursoDescripcion = localStorage.getItem('cursoDescripcion');
    const imagenRuta = localStorage.getItem('cursoImagenRuta');
    const cursoId = localStorage.getItem('cursoId');

    // Cargar los detalles del curso seleccionado
    if (nombreCurso) {
        document.querySelector('.nombre-curso').textContent = nombreCurso;
    } else {
        console.error('No se encontró nombre del curso en localStorage');
    }

    // Mostrar mensaje de bienvenida si el usuario está logueado
    if (nombreUsuario) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = nombreUsuario;
        } else {
            console.error('Elemento userName no encontrado en el DOM');
        }
    } else {
        console.error('Nombre de usuario no encontrado en localStorage');
    }


    if (cursoDescripcion) {
        const descripcionElemento = document.querySelector('.descripcion-curso');
        if (descripcionElemento) {
            descripcionElemento.textContent = cursoDescripcion;
        } else {
            console.error('Elemento .descripcion-curso no encontrado en el DOM');
        }
    }

    if (imagenRuta) {
        document.querySelector('.imagen-curso').src = `http://localhost:3000${imagenRuta}`;
    } else {
        document.querySelector('.imagen-curso').src = '../diseño/css/img/python.png';
        console.error('No se encontró ruta de imagen del curso en localStorage');
    }

    // Manejar la inscripción al curso
    document.getElementById('Inscribirme').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/api/inscripciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_estudiante: idUsuario, id_curso: cursoId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Inscripción exitosa:', result);

            // Redirigir a la página principal después de la inscripción
            window.location.href = '../studentview.html';
        } catch (error) {
            console.error('Error al inscribirse en el curso:', error);
        }
    });
});

// Manejar el cierre de sesión
document.querySelector('#logout').addEventListener('click', () => {
    // Eliminar datos del usuario del localStorage
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('access_token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idUsuario');

    // Redirigir al usuario a welcome.html
    window.location.href = '../welcome.html';
});
