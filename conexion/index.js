const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importar Pool desde el controlador pg
const { sequelize, Persona, Curso, Inscripcion, Categoria, Leccion } = require('./models'); // Importar los modelos
const multer = require('multer');
const path = require('path');


const app = express();
const PORT = 3000;

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: 'postgres', // Reemplaza 'tu_usuario' con el nombre de usuario de tu base de datos
    host: 'localhost',
    database: 'academiavirtual', // Reemplaza 'tu_basededatos' con el nombre de tu base de datos
    password: 'root', // Reemplaza 'tu_contraseña' con la contraseña de tu base de datos
    port: 5432 // Puerto por defecto de PostgreSQL
});


app.use(cors());
// Middleware para permitir el análisis de datos JSON
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Rutas para tu API
app.get('/api/personas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM personas');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener personas:', error);
        res.status(500).json({ error: 'Error al obtener personas' });
    }
});

// Más rutas...
// Ruta para registrar un nuevo usuario
app.post('/api/personas', async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasena } = req.body;

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        console.log('Contraseña encriptada:', hashedPassword);


        // Lógica para insertar el nuevo usuario en la base de datos
        const result = await pool.query('INSERT INTO personas (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4)', [nombre, apellido, correo, contrasena]);
        // Respuesta de éxito
        res.status(200).json({ message: 'Usuario registrado exitosamente', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
    }
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Endpoint para el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        console.log('Iniciando proceso de autenticación para el correo:', correo);

        // Buscar al usuario en la base de datos por correo electrónico
        const usuario = await pool.query('SELECT * FROM personas WHERE correo = $1', [correo]);

        if (usuario.rows.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        console.log('Usuario encontrado:', usuario.rows[0]);
        // Verificar si la contraseña coincide con la almacenada en la base de datos
        const hashedPassword = usuario.rows[0].contrasena;
        console.log('Contraseña proporcionada:', contrasena);
        console.log('Contraseña almacenada:', hashedPassword);


        // Verificar si la contraseña coincide con la almacenada en la base de datos
        if (contrasena !== hashedPassword) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }
        console.log('Contraseña correcta');

        const nombre = usuario.rows[0].nombre;

        const tipo = usuario.rows[0].tipo;

        const id = usuario.rows[0].id;
        // Si las credenciales son válidas, generamos un token de acceso
        const accessToken = jwt.sign({ correo: correo }, 'secreto', { expiresIn: '1h' });

        // Devolvemos el token de acceso en el formato deseado
        res.status(200).json({ access_token: accessToken, nombre: nombre, tipo: tipo, id: id });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ error: 'Error al autenticar usuario' });
    }
});

// Ruta para obtener todos los cursos
app.get('/api/cursos', async (req, res) => {
    try {
        const cursos = await Curso.findAll(); // Asume que estás usando Sequelize
        res.json(cursos);
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        res.status(500).json({ error: 'Error al obtener los cursos' });
    }
});

//Ruta para obtener todas las categorias 
app.get('/api/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías' });
    }
});


// Ruta para agregar un nuevo curso con imagen
app.post('/api/cursos', upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, id_categoria } = req.body;
    const imagenRuta = req.file ? `/uploads/${req.file.filename}` : null; // Guardar la ruta de la imagen

    console.log('Ruta de la imagen:', imagenRuta);

    try {

        // Crear un nuevo curso en la base de datos
        const nuevoCurso = await Curso.create({
            nombre,
            descripcion,
            id_profesor: 3,
            id_categoria: parseInt(id_categoria),
            imagenruta: imagenRuta
        });

        res.status(201).json({
            message: 'Curso creado exitosamente',
            curso: nuevoCurso
        });
    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({ error: 'Error al crear curso' });
    }
});

//Añadir categorias a la api
app.post('/api/categorias', upload.single('areaImage'), async (req, res) => {
    const { areaName, areaDescription } = req.body;
    const imagenRuta = req.file ? `/uploads/${req.file.filename}` : null; // Guardar la ruta de la imagen

    console.log('Ruta de la imagen:', imagenRuta);

    try {
        // Crear una nueva categoría en la base de datos
        const nuevaCategoria = await Categoria.create({
            nombre: areaName,
            descripcion: areaDescription,
            imagenruta: imagenRuta
        });

        res.status(201).json({
            message: 'Categoría creada exitosamente',
            categoria: nuevaCategoria
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
});


// Ruta para crear una nueva inscripción
app.post('/api/inscripciones', async (req, res) => {
    const { id_estudiante, id_curso } = req.body;
    
    try {
        const nuevaInscripcion = await Inscripcion.create({
            id_estudiante: parseInt(id_estudiante),
            id_curso: parseInt(id_curso)
        });
        res.status(201).json(nuevaInscripcion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la inscripción' });
    }
});


// Endpoint para obtener detalles de una categoría por ID
app.get('/api/categorias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const categoria = await Categoria.findByPk(id); // Suponiendo que findByPk busca por clave primaria

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(categoria); // Devuelve la categoría encontrada como JSON
    } catch (error) {
        console.error('Error al obtener la categoría por ID:', error);
        res.status(500).json({ error: 'Error al obtener la categoría' });
    }
});

//Ruta para obtener los cursos de un usuario
app.get('/api/cursos/:idUsuario', async (req, res) => {
    const idUsuario = req.params.idUsuario;

    try {
        const inscripciones = await Inscripcion.findAll({
            where: { id_estudiante: idUsuario },
            include: {
                model: Curso,
                attributes: ['id', 'nombre', 'imagenruta', 'descripcion'] // Incluye la columna 'descripcion'
            }
        });
        res.json(inscripciones.map(inscripcion => ({
            id: inscripcion.Curso.id,
            nombre: inscripcion.Curso.nombre,
            imagenRuta: inscripcion.Curso.imagenruta,
            descripcion: inscripcion.Curso.descripcion
        })));
    } catch (error) {
        console.error('Error al obtener cursos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener cursos del usuario' });
    }
});


// Eliminar una categoría por ID
app.delete('/api/categorias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await categoria.destroy();
        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
});


// Ruta para obtener cursos por id_categoria
app.get('/api/cursos/categoria/:id_categoria', async (req, res) => {
    const id_categoria = req.params.id_categoria;
    try {
        const cursos = await Curso.findAll({ where: { id_categoria } });
        res.json(cursos);
    } catch (error) {
        console.error('Error al obtener los cursos por categoría:', error);
        res.status(500).send('Error al obtener los cursos por categoría');
    }
});

// Ruta para obtener todas las lecciones de un curso por su ID
app.get('/api/curso/:cursoId/lecciones', async (req, res) => {
    const { cursoId } = req.params;

    try {
        const lecciones = await Leccion.findAll({
            where: { id_curso: cursoId }
        });

        if (!lecciones) {
            return res.status(404).json({ message: 'No se encontraron lecciones para el curso especificado' });
        }

        res.json(lecciones);
    } catch (error) {
        console.error('Error al obtener las lecciones:', error);
        res.status(500).json({ message: 'Error al obtener las lecciones' });
    }
});



sequelize.sync().then(() => {
    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}).catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
});

module.exports = app;
