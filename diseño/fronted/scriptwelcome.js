window.onload = async function () {
    hideOptions();

    // Obtener todos los cursos
    try {
        const response = await fetch('http://localhost:3000/api/cursos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cursos = await response.json();
        console.log('Cursos obtenidos:', cursos);

        const coursesContainer = document.querySelector('.certificaciones-populares');
        coursesContainer.innerHTML = '';

        if (cursos.length === 0) {
            coursesContainer.innerHTML = '<p>No hay cursos disponibles</p>';
        } else {
            cursos.forEach(curso => {
                const card = document.createElement('div');
                card.className = 'curso-popular';

                const img = document.createElement('img');
                img.className = 'imagenclase';
                img.src = `http://localhost:3000${curso.imagenruta}`;
                img.alt = curso.nombre;
                img.onerror = () => { img.src = 'css/img/default-image.png'; };

                const nombre = document.createElement('p');
                nombre.className = 'nombre-curso';
                nombre.textContent = curso.nombre;

                const descripcion = document.createElement('p');
                descripcion.className = 'descripcion-curso';
                descripcion.textContent = curso.descripcion;

                card.appendChild(img);
                card.appendChild(nombre);
                card.appendChild(descripcion);
                coursesContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
    }

    // Obtener todas las categorías
    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categorias = await response.json();

        const areasContainer = document.querySelector('.explorarareas');
        areasContainer.innerHTML = '';

        categorias.forEach(categoria => {
            const card = document.createElement('div');
            card.className = 'area-popular';
            card.onclick = () => window.location.href = `modeloarea.html?categoriaId=${categoria.id}`;


            const img = document.createElement('img');
            img.className = 'imagen-area';
            img.src = `http://localhost:3000${categoria.imagenruta}`;
            img.alt = categoria.nombre;

            const nombre = document.createElement('p');
            nombre.className = 'nombre-area';
            nombre.textContent = categoria.nombre;

            card.appendChild(img);
            card.appendChild(nombre);
            areasContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
};

function showExplorer() {
    var menuExplorar = document.getElementById("explorar");
    menuExplorar.size = 3;
}

function hideExplorer() {
    var menuExplorar = document.getElementById("explorar");
    menuExplorar.size = 1;
}

function toggleMenu() {
    var menu = document.querySelector('nav.menu');
    menu.classList.toggle('show');
}
