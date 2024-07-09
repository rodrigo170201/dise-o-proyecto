const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('academiavirtual', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
});

const Persona = sequelize.define('Persona', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    correo: DataTypes.STRING,
    contrasena: DataTypes.STRING,
    tipo: DataTypes.STRING
}, { tableName: 'personas', timestamps: false });

const Curso = sequelize.define('Curso', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagenruta: {
        type: Sequelize.STRING,
        allowNull: true
    },
    id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_profesor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3
    }
}, { tableName: 'cursos', timestamps: false });

const Categoria = sequelize.define('Categoria', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagenruta: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }, {
    tableName: 'categorias',timestamps: false,
  });

const Inscripcion = sequelize.define('Inscripcion', {
    id_estudiante: DataTypes.INTEGER,
    id_curso: DataTypes.INTEGER
}, { tableName: 'inscripciones', timestamps: false });

const Leccion = sequelize.define('Leccion', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_curso: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    link: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { tableName: 'lecciones', timestamps: false });

Curso.hasMany(Leccion, { foreignKey: 'id_curso' });
Leccion.belongsTo(Curso, { foreignKey: 'id_curso' });

Inscripcion.belongsTo(Curso, { foreignKey: 'id_curso' }); 
Curso.hasMany(Inscripcion, { foreignKey: 'id_curso' });


module.exports = { sequelize, Persona, Curso, Categoria, Inscripcion, Leccion };
