import express from 'express';
import { inicio, categoria, notFound, buscador } from '../controllers/appController.js';
import identificarUsuario from '../middleware/identificarUsuario.js';

const router = express.Router();

// Página de inicio
router.get('/', identificarUsuario, inicio);

// Categorías
router.get('/categorias/:id', identificarUsuario, categoria);

// Página 404
router.get('/404', identificarUsuario, notFound);

// Buscador
router.post('/buscador', identificarUsuario, buscador);

export default router;