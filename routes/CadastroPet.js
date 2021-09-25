const express = require('express');
const router = express.Router();
const login = require('../middleware/verificaAuth')
const controllerPet = require('../controllers/Cadastro-Pet');

router.post('/cadastroPet', login.obrigatorio, controllerPet.postCadastroPet);
router.get('/meuPet', login.obrigatorio, controllerPet.getMeuPet)
module.exports = router;