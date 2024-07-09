document.querySelector('.btnSignin').addEventListener('click', async (event) => {
    event.preventDefault();

    const firstName = document.querySelector('.FirstName').value;
    const lastName = document.querySelector('.LastName').value;
    const email = document.querySelector('.Email').value;
    const password = document.querySelector('.Password').value;

    try {
        const response = await fetch('http://localhost:3000/api/personas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: firstName, apellido: lastName, correo: email, contrasena: password })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Registro exitoso');
            console.log('Usuario registrado:', data.usuario);
            // Redirigir a studentview.html
            window.location.href = 'studentview.html';
        } else {
            console.log(response.status);
            console.log(response.statusText);
            alert('Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});

