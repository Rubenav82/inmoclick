//Creamos otro seeder para no tener que estar creando usuarios de forma manual
import bcrypt from 'bcrypt';

const usuarios = [{
    nombre: 'Ruben',
    email: 'ruben@ruben.com',
    confirmado: 1,
    password: bcrypt.hashSync('password', 10)
}];

export default usuarios;