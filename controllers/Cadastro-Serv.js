const mysql = require('../config/db').pool;

exports.postCadastroServico = (req, res, next) => {
    const serv = {
        banho : req.body.banho,
        tosa : req.body.tosa,
        tosa_hig : req.body.tosa_hig,
        hidra_pelos : req.body.hidra_pelos,
        desembaraca : req.body.desembaraca,
        escova_dentes : req.body.escova_dentes,
        limpa_ouvido : req.body.limpa_ouvido,
        corte_unha : req.body.corte_unha
    };
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO Servicos(ID_USER, ID_PET, banho, tosa, desembaraca, escova_dentes, limpa_ouvido, corte_unha)VALUES(?,?,?,?,?,?,?,?)',
            [req.params.ID_USER, req.params.ID_PET, serv.banho, serv.tosa, serv.desembaraca, serv.escova_dentes, serv.limpa_ouvido, serv.corte_unha],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        mensagem: "Falha ao cadastrar serviço"
                    });
                };

                res.status(201).send({
                    mensagem: "Serviço cadastrado com sucesso!",
                    ID_PET: req.params.ID_PET,
                    ID_USER: req.params.ID_USER,
                    Servico_Cadastrado: {
                        banho : req.body.banho,
                        tosa : req.body.tosa,
                        tosa_hig : req.body.tosa_hig,
                        hidra_pelos : req.body.hidra_pelos,
                        desembaraca : req.body.desembaraca,
                        escova_dentes : req.body.escova_dentes,
                        limpa_ouvido : req.body.limpa_ouvido,
                        corte_unha : req.body.corte_unha
                    }
                });
            }
        );
    });

};


exports.getUserService = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'Select * from servicos where ID_USER = ? and ID_PET = ? order by ID_SERVICO desc',
            [req.params.ID_USER,req.params.ID_PET],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                };

                res.status(200).send({
                    mensagem: "Questões do usuário!",
                    Query_result: resultado
                });
            }
        );
    });
};


exports.getAgendamentos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'select title, DATE_FORMAT( startDate, "%Y-%m-%d %H:%i" ) AS startDate , DATE_FORMAT( endDate, "%Y-%m-%d %H:%i" ) AS endDate, ID_AGENDAMENTO as id, location from Agendamentos order by ID_AGENDAMENTO asc',
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        mensagem: "Falha ao realizar agendamento"
                    });
                };
                
            
                res.status(200).send({
                    mensagem: "Agendamento realizado com sucesso",
                    Query_result: result
                });
            }
        );
    });
};

exports.getAgendamentosFormatado = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'select title, DATE_FORMAT( startDate, "%d/%m/%Y às %H:%i" ) AS startDate , DATE_FORMAT( endDate, "às %H:%i" ) AS endDate, ID_AGENDAMENTO as id from Agendamentos where ID_USER = ? order by ID_AGENDAMENTO desc',
            req.usuario.id_user,
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        mensagem: "Falha ao realizar agendamento"
                    });
                };
                
            
                res.status(200).send({
                    mensagem: "Agendamento realizado com sucesso",
                    Query_result: result
                });
            }
        );
    });
};


exports.deleteAgendamento = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(`
        delete pet_user, agendamentos, servicos from pet_user inner join agendamentos on pet_user.id_pet = agendamentos.id_pet
         inner join servicos on servicos.id_pet = agendamentos.id_pet where agendamentos.id_pet = ?`,
            [req.params.id_agendamento],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        mensagem: "Falha ao cancelar agendamento!"
                    });
                };

                res.status(200).send({
                    mensagem: "Agendamento cancelado com sucesso!"
                });
            }
        );
    });
};


exports.postCadastroAgendamento = (req, res, next) => {
    
    const Agendamento = {
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location
    };
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO Agendamentos(title,startDate,endDate,location, ID_USER, ID_PET)VALUES(?,?,?,?,?,?)',
            [Agendamento.title, Agendamento.startDate, Agendamento.endDate, Agendamento.location, req.usuario.id_user, req.params.ID_PET],
            (error, resultado, field) => {
                conn.release();
                console.log(resultado);
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                };

                res.status(201).send({
                    mensagem: "Agendamento realizado com sucesso!",
                    id_Agendamento: resultado.insertId,
                    Agendamento_Cadastrado: Agendamento
                });
            }
        );
    });

}


exports.getDadosCockpit = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `
            select  
            users.NOME, 
            pet_user.NOME_PET, 
            users.CPF, 
            users.TELEFONE,
             DATE_FORMAT( agendamentos.startDate, "%d/%m/%Y" ) AS DataAgendada, 
             DATE_FORMAT( agendamentos.startDate, "%H:%i" ) AS horario_1 , 
             DATE_FORMAT( agendamentos.endDate, "%H:%i" ) as horario_2 
             from users inner join pet_user on users.id_user = pet_user.id_user 
             inner join agendamentos on users.id_user = agendamentos.id_user and pet_user.id_pet = agendamentos.id_pet;
             `,
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        mensagem: "Falha ao consultar dados"
                    });
                };
                
            
                res.status(200).send({
                    mensagem: "Agendamento realizado com sucesso",
                    Query_result: result
                });
            }
        );
    });
};


exports.getDadosAgendamentoUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            `
            select  
            users.NOME, 
            pet_user.NOME_PET, 
            users.CPF, 
            users.TELEFONE,
             DATE_FORMAT( agendamentos.startDate, "%d/%m/%Y" ) AS DataAgendada, 
             DATE_FORMAT( agendamentos.startDate, "%H:%i" ) AS horario_1 , 
             DATE_FORMAT( agendamentos.endDate, "%H:%i" ) as horario_2 
             from users inner join pet_user on users.id_user = pet_user.id_user 
             inner join agendamentos on users.id_user = agendamentos.id_user and pet_user.id_pet = agendamentos.id_pet where users.id_user = ?;
             `,
            req.usuario.id_user,
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                        mensagem: "Falha ao consultar dados"
                    });
                };
                
            
                res.status(200).send({
                    mensagem: "Agendamentos do usuário",
                    Query_result: result
                });
            }
        );
    });
};