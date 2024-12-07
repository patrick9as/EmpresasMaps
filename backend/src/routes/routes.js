const { Router } = require('express');
const routes = Router();

const controllerMaps = require('../controller/maps');
const controllerMercadoLivre = require('../controller/mercadolivreController');
const amazonController = require('../controller/amazonController');

routes.use(controllerMaps);
routes.use(controllerMercadoLivre);
routes.use(amazonController);

module.exports = routes;