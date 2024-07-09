document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('explorar');
    if (selectElement && !selectElement.dataset.loaded) {
        fetchCategorias();
        selectElement.dataset.loaded = true;
    }
    /*fetchCategorias();*/
});

async function fetchCategorias() {
    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categorias = await response.json();
        console.log('Categorías obtenidas:', categorias);

        const selectElement = document.getElementById('explorar');
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
}


function handleSelectionChange(selectElement) {
    const selectedValue = selectElement.value;
    if (selectedValue !== 'explorar') {
        // Redirige siempre a programacion.html
        window.location.href = `modeloarea.html?id=${selectedValue}`;
    }
}

function handleSelectionUs(selectElement) {
    const selectedValue = selectElement.value;
    switch (selectedValue) {
        case "mision":
            window.location.href = "informacion.html";
            break;
        case "vision":
            window.location.href = "informacion.html";
            break;
        case "ayuda":
            window.location.href = "informacion.html";
            break;
        default:
            break;
    }
}
