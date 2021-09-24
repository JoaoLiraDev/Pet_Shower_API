const mysql = require('../config/db').pool;

exports.postCadastroPet = (req, res, next) => {
    const pet = {
        nome_pet: req.body.nome_pet,
        porte_pet: req.body.porte_pet,
        endereco_pet: req.body.endereco_pet,
        categoria_pet: req.body.categoria_pet
    };
    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO pet_user(ID_USER ,NOME_PET, PORTE_PET, ENDERECO_PET, CATEGORIA_PET)VALUES(?,?,?,?,?)',
            [req.usuario.id_user, pet.nome_pet, pet.porte_pet, pet.endereco_pet, pet.categoria_pet],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                };

                res.status(201).send({
                    mensagem: "Pet cadastrado com sucesso!",
                    ID_PET: resultado.insertId,
                    ID_USER: req.usuario.id_user,
                    Pet_Cadastrado: {
                        NOME_PET: req.body.nome_pet,
                        PORTE_PET: req.body.porte_pet,
                        ENDERECO_PET: req.body.endereco_pet,
                        CATEGORIA_PET: req.body.categoria_pet,
                    }
                });
            }
        );
    });

}
