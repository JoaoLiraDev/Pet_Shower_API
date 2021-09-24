const express = require('express');
const router = express.Router();
const login = require('../middleware/verificaAuth')
const controllerUser = require('../controllers/Cadastro-user');

router.post('/cadastroUsuario', controllerUser.postCadastroUser);
router.post('/login', controllerUser.postLogin)
router.get('/user', login.obrigatorio, controllerUser.getUser)
module.exports = router;