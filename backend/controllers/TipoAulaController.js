import { where } from 'sequelize';
import TipoAula from '../models/TipoAula.js';
import Agendamento from '../models/Agendamento.js';

const tipo_aula = {
    async criar(req, res) {
        try {
            const { nome, valor_hora } = req.body;

            // converter valores (1.500,00 -> 1500.00)
            let converte_valor = valor_hora.replace(/\./g, ''); // remove os pontos de milhar

            if (!nome || !valor_hora) return res.status(400).json({ error: 'parametros invalidos' })

            // const tipo = await TipoAula.findOne({where:{nome:nome}})
            // if(tipo) return res.status(400).json({error:'tipo já existente'});
            //substituir as virgulas por ponto
            const novo_tipo = await TipoAula.create({ nome: nome, valor_hora: converte_valor.replace(',', '.') });

            return res.status(200).json(novo_tipo);

        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    async editar(req, res) {
        try {
            const { nome, valor_hora } = req.body;
            const id_tipo = req.params.id
            if (!id_tipo) return res.status(400).json({ error: 'parametros invalidos' })

            let converte_valor = valor_hora.replace(/\./g, '');

            const tipo = await TipoAula.findByPk(id_tipo)
            if (!tipo) return res.status(404).json({ error: 'tipo não encontrado' });

            await tipo.update({ nome: nome, valor_hora: converte_valor.replace(',', '.')});

            return res.status(200).json(tipo);

        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async list(req, res) {
        try {
            const tipos_aula = await TipoAula.findAll();

            return res.status(200).json(tipos_aula);

        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async buscar(req, res) {
        try {
            const id = req.params.id
            if (!id) return res.status(500)
            const tipos_aula = await TipoAula.findByPk(id);

            return res.status(200).json(tipos_aula);

        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async excluir(req, res) {
        try {
            const id_tipo = req.params.id
            if (!id_tipo) return res.status(400).json({ error: 'parametros invalidos' })

            const tipo = await TipoAula.findByPk(id_tipo)
            if (!tipo) return res.status(404).json({ error: 'tipo não encontrado' });

            const agendamentos = await Agendamento.findAll({ where: { tipo_aula_id: tipo.id } })

            if (agendamentos.length > 0) return res.status(500).json({ error: true, message: 'existem agendamentos vinculados com esse tipo' })
            await tipo.destroy();

            return res.status(200).json({ msg: 'tipo excluido com sucesso' });

        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

}
export default tipo_aula
