const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json({ limit: '2mb' }));

const routes = require('./routes/routes');
app.use(cors());
app.use(bodyParser.json())

app.use(routes);
app.listen(8080, ()=>{
    console.log(`Servidor rodando na porta: ${8080}`);
});