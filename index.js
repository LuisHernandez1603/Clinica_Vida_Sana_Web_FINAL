const express = require('express');
const cors = require('cors');
const pacienteRoutes = require('./routers/pacienteRoutes.js');



const app = express();
app.use(express.json());
app.use(cors());

app.use('/', pacienteRoutes);

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
