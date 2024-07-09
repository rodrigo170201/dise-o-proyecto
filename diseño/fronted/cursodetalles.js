document.addEventListener('DOMContentLoaded', async () => {
    const nombreCurso = localStorage.getItem('cursoNombre');
    const descripcionCurso = localStorage.getItem('cursoDescripcion');
    const imagenRuta = localStorage.getItem('cursoImagenRuta');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const cursoId = localStorage.getItem('cursoId');
    console.log('Datos del curso:', nombreCurso, descripcionCurso, imagenRuta); // Verificar los datos obtenidos

    if (nombreCurso) {
        document.querySelector('.nombre-curso').textContent = nombreCurso;
    } else {
        console.error('No se encontró nombre del curso en localStorage');
    }

    if (descripcionCurso) {
        document.querySelector('.descripcion-curso').textContent = descripcionCurso;
    } else {
        document.querySelector('.descripcion-curso').textContent = 'No se encontró descripción del curso.';
        console.error('No se encontró descripción del curso en localStorage');
    }

    if (imagenRuta) {
        document.querySelector('.imagen-curso').src = `http://localhost:3000${imagenRuta}`;
    } else {
        document.querySelector('.imagen-curso').src = '../diseño/css/img/default.png';
        console.error('No se encontró ruta de imagen del curso en localStorage');
    }

    if (nombreUsuario) {
        document.getElementById('userName').textContent = nombreUsuario;
    } else {
        console.error('No se encontró nombre de usuario en localStorage');
    }

    try {
        // Obtener las lecciones del curso actual desde la API
        const response = await fetch(`http://localhost:3000/api/curso/${cursoId}/lecciones`); // Ajusta la ruta de la API según tu backend
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const lecciones = await response.json();

        const leccionesContainer = document.querySelector('.lecciones');
        leccionesContainer.innerHTML = ''; 

        lecciones.forEach(leccion => {
            const card = document.createElement('div');
            card.className = 'card';

            const link = document.createElement('a');
            link.href = leccion.link; // Enlace del video
            link.target = '_blank';

            const img = document.createElement('img');
            img.src = obtenerMiniaturaYoutube(leccion.link);
            img.alt = 'Miniatura del video';
            img.className = 'imagenclase';

            const nombreLeccion = document.createElement('p');
            nombreLeccion.className = 'nombre-leccion';
            nombreLeccion.textContent = leccion.nombre; // Nombre de la lección desde la base de datos

            link.appendChild(img);
            card.appendChild(link);
            card.appendChild(nombreLeccion);
            leccionesContainer.appendChild(card);

            // Evento para reproducir el video al hacer clic en la imagen
            img.addEventListener('click', (event) => {
                event.preventDefault(); // Prevenir la navegación por defecto
                reproducirVideo(leccion.link);
            });
        });

    } catch (error) {
        console.error('Error al obtener las lecciones del curso:', error);
    }

    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('access_token');
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('idUsuario');

        window.location.href = 'welcome.html';
    });
});

function obtenerMiniaturaYoutube(link) {
    const videoId = extraerVideoId(link);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function extraerVideoId(link) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
}

function reproducirVideo(url) {
    const videoId = extraerVideoId(url);
    const videoFrame = document.createElement('iframe');
    videoFrame.width = '560';
    videoFrame.height = '315';
    videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
    videoFrame.frameBorder = '0';
    videoFrame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    videoFrame.allowFullscreen = true;

    const videoContainer = document.querySelector('.video-container');
    videoContainer.innerHTML = ''; // Limpiar contenido existente
    videoContainer.appendChild(videoFrame);
}
