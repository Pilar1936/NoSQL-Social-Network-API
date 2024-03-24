const express = require('express');
const db = require('./config/connection'); 
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware para analizar solicitudes JSON y urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para manejar las rutas definidas en routes.js
app.use(routes);

// Evento 'open' para la conexión a la base de datos
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
