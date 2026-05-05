import Agendamento from '../models/Agendamento.js';
import Pessoa from '../models/Pessoa.js';
import Professor from '../models/Professor.js';

const pessoa = {
    async criarPessoa(req, res) {
        try {
            const { nome, cpf, cnd } = req.body;

            const pessoa = await Pessoa.findOne({ where: { cpf: cpf } });
            if (pessoa) return res.status(500).json('Já existe uma pessoa com esse cpf!');

            const nova_pessoa = await Pessoa.create({ nome: nome, cpf: cpf });

            if(cnd){
                await Professor.create({pessoa_id: pessoa.id, cnd: cnd})
            }

            return res.status(200).json(pessoa);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async editarPessoa(req, res) {
        try {
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

    async listarPessoas(req, res) {
        try {
            const pessoas = await Pessoa.findAll();

            return res.status(200).json(pessoas);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async deletar(req, res) {
        try {
            const pessoa_id = req.params.id;
            // se tiver agendamento não pode excluir
            const agendamentos = await Agendamento.findAll({ where: { aluno_id: pessoa_id } });

            //caso seja professor, excluir essa relação tbm

            return res.status(200).json(pessoas);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
};

export default pessoa;
