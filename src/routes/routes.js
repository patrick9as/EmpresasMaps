const { Router } = require('express');
const routes = Router();

const controllerMaps = require('../controller/maps');

routes.use(controllerMaps);

module.exports = routes;