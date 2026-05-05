import Agendamento from '../models/Agendamento.js';
import Aula from '../models/Aula.js';


const agendamento = {
    /*
    "data":  "04/05/2026" (formato br),
    "horario_inicio": "19:00",
    "horario_fim": "20:00",
    "aula_id": 1,
    "pessoa_id": 1,
    "professor_id": "2"
    */
    async criar(req, res) {
        try {
            const { data, horario_inicio, horario_fim, aula_id, pessoa_id, professor_id } = req.body;

            if (pessoa_id === professor_id) return res.status(500).json('Aluno e professor não podem ser a mesma pessoa.');

            //verificar se a aula para qual esta tentando criar um agendamento existe
            const aula = await Aula.findByPK(aula_id);

            let calcula_valor = 0;

            // se nao tiver a aula ja retorna
            if (!aula) return res.status(500).json('Aula não encontrada.');

            //verificar se o aluno e professor existe e se o professor é de fato professor (existe na tabela de professor)
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async editar(req, res) {
        try {
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async deletar(req, res) {
        try {
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async listar(req, res) {
        try {
            const agendamentos = await Agendamento.findAll();

            return res.status(200).json(agendamentos);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async buscar(req, res) {
        try {
            const agendamento_id = req.params.id;

            const agendamento = await Agendamento.findByPK(agendamento_id);

            if (!agendamento) return res.status(500).json('Não encontrado');

            return res.status(200).json(agendamento);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
};

export default agendamento;