const { Router } = require('express');
const routes = Router();

const controllerMaps = require('../controller/maps');
const controllerMercadoLivre = require('../controller/mercadoLivre');

routes.use(controllerMaps);
routes.use(controllerMercadoLivre);

module.exports = routes;