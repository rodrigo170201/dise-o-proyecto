document.querySelector('.login').addEventListener('click', async () => {
    const email = document.querySelector('.txtEmail').value;
    const password = document.querySelector('.txtPss').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo: email, contrasena: password })
        });    

        if (response.ok) {
            const data = await response.json();
            console.log('Token de acceso:', data.access_token);

            localStorage.setItem('nombreUsuario', data.nombre);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('tipoUsuario', data.tipo);
            localStorage.setItem('idUsuario', data.id);

            console.log('Tipo de usuario:', data.tipo);

            // Redirigir basado en el tipo de usuario y su ID
            if (data.tipo === 'profesor') {
                window.location.href = 'admin.html';
            } else if (data.tipo === 'estudiante') {
                window.location.href = 'studentview.html';
            }

            document.querySelector('.txtEmail').value = '';
            document.querySelector('.txtPss').value = '';

        } else {
            console.log(response.status);
            console.log(response.statusText);
            alert('Correo electrónico o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});
