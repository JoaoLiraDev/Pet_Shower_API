const express = require('express');
const router = express.Router();
const login = require('../middleware/verificaAuth')
const controllerPet = require('../controllers/Cadastro-Pet');

router.post('/cadastroPet', login.obrigatorio, controllerPet.postCadastroPet);

module.exports = router;