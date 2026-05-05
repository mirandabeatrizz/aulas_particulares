import { QueryTypes } from 'sequelize';
import Agendamento from '../models/Agendamento.js';
import Pessoa from '../models/Pessoa.js';
import Professor from '../models/Professor.js';

const pessoa = {
    async criarPessoa(req, res) {
        try {
            const { nome, cpf, cnd } = req.body;

            //const pessoa = await Pessoa.findOne({ where: { cpf: cpf } });
            const pessoa = await Pessoa.sequelize.query(`select a.id, a.nome, a.cpf, p.cnd from pessoa a left join professor p on p.pessoa_id = a.id
                where a.cpf='${cpf}'`, { type: QueryTypes.SELECT });

            //se a pessoa ja existir e nao esta tentando criar professor
            if (pessoa.length > 0) {
                //pessoa existe e nao tem vinculo com professor
                if (cnd && !pessoa[0].cnd) {
                    await Professor.create({ pessoa_id: pessoa[0].id, cnd: cnd })
                    return res.status(200).json('Pessoa vinculada como professor')
                }
                return res.status(500).json(pessoa[0].cnd && cnd ? 'Já existe um professor com esse cpf cadastrado!' : 'Já existe uma pessoa com esse cpf cadastrado!');
            }

            const nova_pessoa = await Pessoa.create({ nome: nome, cpf: cpf });

            if (cnd) {
                await Professor.create({ pessoa_id: nova_pessoa.id, cnd: cnd })
            }

            return res.status(200).json('Criado com sucesso');
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async editarPessoa(req, res) {
        try {
            const { nome, cpf, cnd } = req.body;
            const pessoa_id = req.params.id;

            const pessoa = await Pessoa.findByPk(pessoa_id);

            if (!pessoa) return res.status(500).json('Pessoa não encontrada')

            if(pessoa.cpf == cpf) return res.status(500).json('Não é possível atualizar o cpf para um cpf já cadastrado')

            await pessoa.update({
                nome: nome,
                cpf: cpf
            });

            if(cnd){
                const professor = await Professor.findOne({where:{pessoa_id: pessoa.id}});
                if(!professor){
                    await Professor.create({cnd: cnd, pessoa_id: pessoa.id});
                }
                await professor.update({cnd:cnd});
            }

            return res.status(200).json('sucesso')
                
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async buscarPessoa(req, res) {
        try {
            const id = req.params.id;

            const pessoa = await Pessoa.findByPk(id);

            return res.status(200).json(pessoa);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async buscarPorCpf(req, res) {
        try {
            const cpf = req.params.cpf;

            const pessoa = await Pessoa.findOne({ where: { cpf: cpf } });

            return res.status(200).json(pessoa);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    // filtrar: Todos, Alunos, Professores
    async listarPessoas(req, res) {
        try {
            const filtro = req.query.filtro;

            let sqlQuery = `
                WITH PessoasComPerfil AS (
                    SELECT a.id, a.nome, a.cpf,
                    CASE WHEN p.pessoa_id IS NOT NULL THEN 'Professor' ELSE 'Aluno' END AS perfil 
                    FROM pessoa a LEFT JOIN professor p ON p.pessoa_id = a.id
                )
                SELECT * FROM PessoasComPerfil
            `;

            if (filtro === 'Professor') {
                sqlQuery += ` WHERE perfil = 'Professor'`;
            } else if (filtro === 'Aluno') {
                sqlQuery += ` WHERE perfil = 'Aluno'`;
            }

            const resultados = await Pessoa.sequelize.query(sqlQuery, { type: QueryTypes.SELECT });

            return res.status(200).json(resultados);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    async deletar(req, res) {
        try {
            const pessoa_id = req.params.id;
            // se tiver agendamento não pode excluir
            const agendamentos = await Agendamento.findAll({ where: { pessoa_id: pessoa_id } });

            if (agendamentos.length > 0) return res.status(500).json('Não é possível excluir uma pessoa que possui agendamento(s)');

            const professor = await Professor.findOne({ where: { pessoa_id: pessoa_id } });

            if (professor) return res.status(500).json(`Primeiro remova o vinculo de professor (${professor.id}) para excluir a pessoa`);

            await Pessoa.destroy({ where: { id: pessoa_id } });

            return res.status(200).json('Excluido com sucesso');
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    async deletarProfessor(req, res) {
        try {
            const id = req.params.id;
            const excluir_pessoa = req.query.excluir_pessoa;

            if (!id) return res.status(500).json('Parametros invalidos');

            const professor = await Professor.findByPk(id);

            if (!professor) return res.status(500).json('Professor nao encontrado');
            let pessoa_id = professor.pessoa_id;

            await Professor.destroy({ where: { id: professor.id } })

            if (excluir_pessoa === 'true') await Pessoa.destroy({ where: { id: pessoa_id } })

            return res.status(200).json('Professor excluido com sucesso')
        } catch (error) {

            return res.status(500).json(error);
        }
    }
};

export default pessoa;
