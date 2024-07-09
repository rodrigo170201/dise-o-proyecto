document.addEventListener('DOMContentLoaded', () => {
    const imagenCurso = localStorage.getItem('cursoImagen');
    const nombreCurso = localStorage.getItem('cursoNombre');
    const descripcionCurso = localStorage.getItem('cursoDescripcion');

    if (imagenCurso) {
        document.querySelector('.imagen-curso').src = `http://localhost:3000${imagenCurso}`;
    }
    if (nombreCurso) {
        document.querySelector('.nombre-curso').textContent = nombreCurso;
    }
    if (descripcionCurso) {
        document.querySelector('.descripciondelcurso').textContent = descripcionCurso;
    }
});