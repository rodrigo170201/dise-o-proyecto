function handleSelectionChange(selectElement) {
    const selectedValue = selectElement.value;
    switch (selectedValue) {
        case "explorar":
            window.location.href = "../welcome.html";
            break;
        case "programacion":
            window.location.href = "../programacion.html";
            break;
        case "musica":
            window.location.href = "../areas.html";
            break;
        case "idiomas":
            window.location.href = "../idiomas.html";
            break;
        default:
            // No action for the "explorar" option
            break;
    }
}

function handleSelectionUs(selectElement) {
    const selectedValue = selectElement.value;
    switch (selectedValue) {
        case "mision":
            window.location.href = "../informacion.html";
            break;
        case "vision":
            window.location.href = "../informacion.html";
            break;
        case "ayuda":
            window.location.href = "../informacion.html";
            break;
        default:
            break;
    }
}


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

