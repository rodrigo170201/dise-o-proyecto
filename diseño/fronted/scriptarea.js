document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav.menu').classList.toggle('show');
});


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaId = urlParams.get('id');

    if (categoriaId) {
        fetchCategoriaById(categoriaId);
        fetchCursosByCategoriaId(categoriaId);
    } else {
        console.error('No se ha proporcionado un ID de categoría.');
    }
});

async function fetchCategoriaById(categoriaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/categorias/${categoriaId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoria = await response.json();
        console.log('Categoría obtenida por ID:', categoria);

        // Llamar a una función para actualizar la UI con los datos de la categoría
        updateCategoriaUI(categoria);
    } catch (error) {
        console.error('Error al obtener la categoría por ID:', error);
    }
}
function updateCategoriaUI(categoria) {
    const imagenArea = document.querySelector('.imagen-area');
    const nombreArea = document.querySelector('.nombre-area');
    const descripcionArea = document.querySelector('.descripcion-area');

    // Actualizar la imagen, nombre y descripción en el HTML
    imagenArea.src = categoria.imagenruta ? `http://localhost:3000${categoria.imagenruta}` : '';
    nombreArea.textContent = categoria.nombre;
    descripcionArea.textContent = categoria.descripcion;
}

async function fetchCursosByCategoriaId(categoriaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/cursos/categoria/${categoriaId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cursos = await response.json();
        console.log('Cursos obtenidos por ID de categoría:', cursos);

        updateCursosUI(cursos);
    } catch (error) {
        console.error('Error al obtener los cursos por categoría:', error);
    }
}

function updateCursosUI(cursos) {
    const cursosContainer = document.querySelector('.cursos-area');
    cursosContainer.innerHTML = '';

    cursos.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'contenedordiseño';
        card.onclick = () => {
            localStorage.setItem('cursoImagen', curso.imagenruta);
            localStorage.setItem('cursoNombre', curso.nombre);
            localStorage.setItem('cursoDescripcion', curso.descripcion);
            window.location.href = 'cursos/modelocurso.html';
        };
        const img = document.createElement('img');
        img.className = 'imagenclase';
        img.src = `http://localhost:3000${curso.imagenruta}`;
        img.alt = curso.nombre;

        const nombre = document.createElement('p');
        nombre.className = 'cursodelarea';
        nombre.textContent = curso.nombre;

        card.appendChild(img);
        card.appendChild(nombre);
        cursosContainer.appendChild(card);
    });
}