const mysql = require('../config/db').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postCadastroUser = (req, res, next) => {
    const user = {
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        telefone: req.body.telefone,
        email: req.body.email,
        cpf: req.body.cpf,
        endereco: req.body.endereco,
        numero: req.body.numero,
        complemento: req.body.complemento,
        senha: req.body.senha
    };

    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM Users WHERE CPF = ?', [user.cpf], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) };
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado' })
            } else {
                bcrypt.hash(user.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error_crypt: errBcrypt }) }
                    conn.query(
                        'INSERT INTO Users(NOME, SOBRENOME, SENHA, TELEFONE, EMAIL, CPF, ENDERECO, NUMERO, COMPLEMENTO)VALUES(?,?,?,?,?,?,?,?,?)',
                        [user.nome, user.sobrenome, hash, user.telefone, user.email, user.cpf, user.endereco, user.numero, user.complemento],
                        (error, resultado, field) => {
                            conn.release();

                            if (error) { return res.status(500).send({ error: error, response: null }) };

                            response = {
                                mensagem: "Usuário cadastrado com sucesso!",
                                usuario_criado: {
                                    id_user: resultado.insertId,
                                    UsuarioCadastrado: {
                                        NOME: req.body.nome,
                                        SOBRENOME: req.body.sobrenome,
                                        SENHA: hash,
                                        EMAIL: req.body.email,
                                        DADOS_ENDERECO: {
                                            ENDERECO: req.body.endereco,
                                            NUMERO: req.body.numero,
                                            COMPLEMENTO: req.body.complemento
                                        },
                                        DT_CADASTRO: resultado.DT_CADASTRO
                                    }
                                }
                            }

                            return res.status(201).send(response);
                        }
                    );
                });
            }
        });
    });

};


exports.postLogin = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = 'SELECT * FROM Users WHERE EMAIL = ?';
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            }

            bcrypt.compare(req.body.senha, results[0].SENHA, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                if (result) {
                    const token = jwt.sign({
                        id_user: results[0].ID_USER,
                        email: results[0].EMAIL
                    }, 'PetShowerKey', {
                        expiresIn: "7h"
                    });
                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso',
                        token: token,
                        user: {
                            ID_USERS: results[0].ID_USER,
                            CPF: results[0].CPF,
                            NOME: results[0].NOME,
                            SOBRENOME: results[0].SOBRENOME,
                            EMAIL: results[0].EMAIL,
                        }


                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            });
        });
    });
};


exports.getUser = (req, res, next) => {
    console.log(req.usuario)
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM Users WHERE ID_USER = ?',
            req.usuario.id_user,
            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                };

                res.status(200).send({
                    mensagem: "Dados do usuário",
                    user: result[0]
                });
            }
        );
    });
};