document.addEventListener('DOMContentLoaded', async () => {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const idUsuario = localStorage.getItem('idUsuario');

    // Mostrar mensaje de bienvenida si el usuario está logueado
    if (nombreUsuario) {
        document.getElementById('welcomeMessage').textContent = `Bienvenido, ${nombreUsuario}`;
        document.getElementById('userName').textContent = nombreUsuario;
    }
    //Obtener y mostrar todos los cursos 
    try {
        // Obtener todos los cursos desde la API
        const response = await fetch('http://localhost:3000/api/cursos'); // Ajusta la URL según tu configuración
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cursos = await response.json();

        const cardsCursosContainer = document.querySelector('.cards');
        cardsCursosContainer.innerHTML = ''; // Limpiar contenido existente

        cursos.forEach(curso => {
            const card = document.createElement('div');
            card.className = 'card';
            card.addEventListener('click', () => {
                localStorage.setItem('cursoId', curso.id);
                localStorage.setItem('cursoNombre', curso.nombre);
                localStorage.setItem('cursoDescripcion', curso.descripcion);
                localStorage.setItem('cursoImagenRuta', curso.imagenRuta);
                window.location.href = 'cursoslog/javascriptlog.html';
            });

            const img = document.createElement('img');
            img.src = `http://localhost:3000${curso.imagenruta}`; // Ajusta la ruta de la imagen según tu configuración
            img.alt = curso.nombre;

            const nombreCurso = document.createElement('p');
            nombreCurso.textContent = curso.nombre;

            card.appendChild(img);
            card.appendChild(nombreCurso);
            cardsCursosContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
    }
    // Obtener y mostrar los cursos del estudiante si está logueado
    if (idUsuario) {
        try {
            const responseEstudiante = await fetch(`http://localhost:3000/api/cursos/${idUsuario}`);
            if (!responseEstudiante.ok) {
                throw new Error(`HTTP error! status: ${responseEstudiante.status}`);
            }
            const cursosEstudiante = await responseEstudiante.json();

            const coursesContainerEstudiante = document.querySelector('.my-courses');
            coursesContainerEstudiante.innerHTML = ''; // Limpiar las tarjetas existentes

            cursosEstudiante.forEach(curso => {
                const card = document.createElement('div');
                card.className = 'card';
                card.addEventListener('click', () => {

                    localStorage.setItem('cursoId', curso.id);
                    localStorage.setItem('cursoNombre', curso.nombre);
                    localStorage.setItem('cursoDescripcion', curso.descripcion);
                    localStorage.setItem('cursoImagenRuta', curso.imagenRuta);
                    window.location.href = 'cursoDetalles.html';
                });

                const img = document.createElement('img');
                img.src = curso.imagenRuta ? `http://localhost:3000${curso.imagenRuta}` : '../diseño/css/img/default.png';
                img.alt = curso.nombre;

                const nombre = document.createElement('p');
                nombre.textContent = curso.nombre;

                card.appendChild(img);
                card.appendChild(nombre);
                coursesContainerEstudiante.appendChild(card);
            });
        } catch (error) {
            console.error('Error al obtener cursos del usuario:', error);
        }
    }
});

document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('access_token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idUsuario');

    window.location.href = 'welcome.html';
});
