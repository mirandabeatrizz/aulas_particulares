// Regras de negócio referentes ao aula
import { raw } from 'express';
import Agendamento from '../models/Agendamento.js';
import Aula from '../models/Aula.js';
import TipoAula from '../models/TipoAula.js';
import { QueryTypes } from 'sequelize';

const aula = {
    async criar(req, res) {
        try {
            const { tipo_nome, valor_hora } = req.body;

            const tipo = await TipoAula.findOne({ where: { nome: tipo_nome } });
            let tipo_aula;

            if (!tipo) {
                const novo_tipo = await TipoAula.create({ nome: tipo_nome })
                tipo_aula = novo_tipo;
            }

            const aula = await Aula.create({ tipo_id: tipo_aula ? tipo_aula.id : tipo.id, valor_hora: valor_hora });
            return res.status(200).json({ data: aula });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async editar(req, res) {
        try {
            const aula_id = req.params.id;
            const { tipo, valor_hora } = req.body;

            if (!aula_id) return res.status(400).json({ msg: 'Parametros inválidos' });

            const aula = await Aula.findByPk(aula_id);

            if (!aula) return res.status(404).json('Aula não encontrada');

            const tipo_aula = await TipoAula.findOne({ where: { nome: tipo } })

            //se encontrar o tipo e for diferente do tipo atual atualizar
            if (!tipo_aula) {
                const novo_tipo = await TipoAula.create({ nome: tipo });
                await aula.update({ tipo: novo_tipo.id, valor_hora: valor_hora });
            }
            else if (tipo_aula.id !== aula.tipo_id) {
                await aula.update({ tipo: tipo_aula.id, valor_hora: valor_hora });
            }

            return res.status(200).json(aula);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async buscar(req, res) {
        try {
            const aula_id = req.params.id;

            const aula = await Aula.sequelize.query(`Select a.id, t.nome, a.valor_hora from aula a join tipo_aula t on a.tipo_id = t.id where a.id=${aula_id}`, { type: QueryTypes.SELECT });

            return res.status(200).json(aula);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async listar(req, res) {
        try {
            const aulas = await Aula.sequelize.query(`Select a.id, t.nome, a.valor_hora from aula a join tipo_aula t on a.tipo_id = t.id`, { type: QueryTypes.SELECT });

            return res.status(200).json({ data: aulas });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async excluir(req, res) {
        try {
            const aula_id = req.params.id;

            const agendamento = await Agendamento.findOne({ where: { aula_id: aula_id } });

            if (agendamento) return res.status(400).json({ msg: 'Não é possível excluir uma aula com agendamento' });

            const aula = await Aula.findByPk(aula_id)
            if (aula) await Aula.destroy({ where: { id: aula_id } });
            return res.status(200).json(aula ? 'aula excluida com sucesso' : 'aula não encontrada, nenhum dado excluido');

        } catch (error) {
            return res.status(500).json(error);
        }
    },
};

export default aula;
