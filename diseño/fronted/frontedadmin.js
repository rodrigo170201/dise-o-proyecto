document.addEventListener('DOMContentLoaded', async () => {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    
    if (nombreUsuario) {
        document.getElementById('welcomeMessage').textContent = `Bienvenido, ${nombreUsuario}`;
        document.getElementById('userName').textContent = nombreUsuario;
    }

    async function loadCursos() {
        try {
            const response = await fetch('http://localhost:3000/api/cursos'); // Ajusta la URL según tu configuración
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cursos = await response.json();

            const cardsCursosContainer = document.querySelector('.cards-cursos');
            cardsCursosContainer.innerHTML = ''; // Limpiar contenido existente

            cursos.forEach(curso => {
                const card = document.createElement('div');
                card.className = 'card';

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
    }

    //Llamar a la funcion para cargar los cursos 
    await loadCursos();

    //Obtener todas las categorias 
    try {
        // Obtener todas las categorías desde la API
        const response = await fetch('http://localhost:3000/api/categorias'); // Ajusta la URL según tu configuración
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categorias = await response.json();

        const cardsCategoriasContainer = document.querySelector('.cards-categorias');
        cardsCategoriasContainer.innerHTML = ''; // Limpiar contenido existente

        categorias.forEach(categoria => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.className = 'imagen-categoria';
            img.src = `http://localhost:3000${categoria.imagenruta}`; // Ajusta la ruta de la imagen según tu configuración
            img.alt = categoria.nombre;

            const nombreCategoria = document.createElement('p');
            nombreCategoria.className = 'nombre-categoria';
            nombreCategoria.textContent = categoria.nombre;
            

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', async () => {
                const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`);
                if (confirmDelete) {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/api/categorias/${categoria.id}`, {
                            method: 'DELETE'
                        });

                        if (!deleteResponse.ok) {
                            throw new Error(`Error al eliminar la categoría: ${deleteResponse.statusText}`);
                        }

                        alert('Categoría eliminada exitosamente');
                        card.remove(); 
                        await loadCursos();
                    } catch (error) {
                        console.error('Error al eliminar la categoría:', error);
                        alert('Error al eliminar la categoría');
                    }
                }
            });

            card.appendChild(img);
            card.appendChild(nombreCategoria);
            card.appendChild(deleteButton);
            cardsCategoriasContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }

});




//Añadir curso
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.btnañadircurso');
    const formContainer = document.getElementById('formContainer');
    const cancelButton = document.getElementById('cancelButton');
    const cursoAreaSelect = document.getElementById('cursoArea');

    addButton.addEventListener('click', function() {
        formContainer.style.display = 'block';
        loadAreas(); // Cargar las áreas cuando se muestra el formulario
    });

    cancelButton.addEventListener('click', function() {
        formContainer.style.display = 'none';
    });

    document.getElementById('cursoForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch('http://localhost:3000/api/cursos', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Curso añadido exitosamente');
                window.location.reload(); // Recargar la página para mostrar el nuevo curso
            } else {
                alert('Error al añadir el curso');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Error al conectar con el servidor');
        }

        // Ocultar el formulario después de enviar
        formContainer.style.display = 'none';

        // Limpiar el formulario
        this.reset();
    }); 
    
    async function loadAreas() {
        try {
            const response = await fetch('http://localhost:3000/api/categorias');
            const areas = await response.json();

            cursoAreaSelect.innerHTML = '<option value="">Seleccione un área</option>';

            areas.forEach(area => {
                const option = document.createElement('option');
                option.value = area.id;
                option.textContent = area.nombre;
                cursoAreaSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    }

});


//Añadir areas
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.btnañadirarea');
    const formContainer2 = document.getElementById('formContainer2');
    const cancelButton = document.getElementById('cancelButton2');

    addButton.addEventListener('click', function() {
        formContainer2.style.display = 'block';
    });

    cancelButton.addEventListener('click', function() {
        formContainer2.style.display = 'none';
    });

    document.getElementById('areaForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch('http://localhost:3000/api/categorias', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Categoría añadida exitosamente');
                window.location.reload(); // Recargar la página para mostrar la nueva categoría
            } else {
                alert('Error al añadir la categoría');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Error al conectar con el servidor');
        }

        // Ocultar el formulario después de enviar
        formContainer2.style.display = 'none';

        // Limpiar el formulario
        this.reset();
    });    
});




//Salir o logout
document.querySelector('#logout').addEventListener('click', () => {
    // Eliminar datos del usuario del localStorage
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('access_token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idUsuario');

    // Redirigir al usuario a welcome.html
    window.location.href = 'welcome.html';
});

