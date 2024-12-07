const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json())

const routes = require('./routes/routes');
app.use(routes);

const path = require('path');
const distPath = path.join(__dirname, '../dist'); // Caminho correto para o dist
app.use(express.static(distPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html')); // Serve o arquivo index.html
  });

app.listen(process.env.API_PORT, '0.0.0.0', ()=>{
    console.log(`Servidor rodando na porta: ${process.env.API_PORT}`);
});