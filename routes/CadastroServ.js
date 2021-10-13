const express = require('express');
const router = express.Router();
const login = require('../middleware/verificaAuth')
const controllerServ = require('../controllers/Cadastro-Serv');

router.post('/cadastroServico/:ID_USER/:ID_PET', login.obrigatorio, controllerServ.postCadastroServico);

router.get('/buscaServico/:ID_USER/:ID_PET', login.obrigatorio, controllerServ.getUserService);

router.get('/all', login.opcional, controllerServ.getAgendamentos);

router.get('/allFormatado', login.obrigatorio, controllerServ.getAgendamentosFormatado);

router.get('/dadosCockpit', login.obrigatorio, controllerServ.getDadosCockpit);

router.get('/agendamentoUser', login.obrigatorio, controllerServ.getDadosAgendamentoUser);

router.post('/agendamentos/:ID_PET', login.obrigatorio,controllerServ.postCadastroAgendamento);

router.delete('/delete_agendamento/:id_agendamento', login.obrigatorio, controllerServ.deleteAgendamento);

module.exports = router; 