import { Op, QueryTypes } from 'sequelize';
import Agendamento from '../models/Agendamento.js';
import TipoAula from '../models/TipoAula.js';
import dayjs from 'dayjs'

// verificar se os dados estão no formato correto e devolver a duração da aula e calcular o valor que será cobrado conforme o valor da aula por hora
function verificaDadosHoras(hora_inicio, hora_fim, valor_hora) {
    //aceitar somente o formato (HH:mm - 00:00 até 23:59)
    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regexHora.test(hora_inicio) || !regexHora.test(hora_fim)) {
        return { erro: true, msg: "Formato de hora inválido. Use HH:mm (00:00 até 23:59)." };
    }

    // separa a hora e os minutos das entradas
    const [hr_ini, mm_ini] = hora_inicio.split(':').map(Number);
    const [hr_fim, mm_fim] = hora_fim.split(':').map(Number);

    //converte para minutos totais desde a meia-noite
    const total_ini_mm = hr_ini * 60 + mm_ini;
    const total_fim_mm = hr_fim * 60 + mm_fim;

    //verifica se a hora de início é menor que a do fim
    if (total_ini_mm >= total_fim_mm) {
        return { erro: true, msg: "A hora inicial deve ser obrigatoriamente menor que a hora final." };
    }

    //subtrai o total do fim com o do inicio
    const duracao_minutos = total_fim_mm - total_ini_mm;

    // converte a duração de volta para o formato HH:mm
    const horas = Math.floor(duracao_minutos / 60);
    const minutos = duracao_minutos % 60;

    const duracao_formatada =
        String(horas).padStart(2, '0') + ':' +
        String(minutos).padStart(2, '0');

    //calcula o valor total (Convertendo os minutos da duração para horas decimais)
    const horas_decimais = duracao_minutos / 60;
    const valor_total = horas_decimais * valor_hora;

    return {
        sucesso: true,
        duracao: duracao_formatada,
        valor_total: valor_total.toFixed(2) // duas casas decimais 
    }
}

const agendamento = {
    async criar(req, res) {
        try {
            const { data, tipo_aula_id, horario_inicio, horario_fim, aluno, professor } = req.body;

            //verificar se a aula para qual esta tentando criar um agendamento existe
            const aula = await TipoAula.findByPk(tipo_aula_id);

            // se nao tiver a aula ja retorna
            if (!aula) return res.status(404).json('Aula não encontrada.');

            const dados_horarios = verificaDadosHoras(horario_inicio, horario_fim, aula.valor_hora)

            if (dados_horarios.erro) return res.status(400).json(dados_horarios.msg)

            const agend = await Agendamento.create({
                tipo_aula_id: aula.id,
                professor: professor,
                aluno: aluno,
                valor_final: dados_horarios.valor_total,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim,
                duracao: dados_horarios.duracao,
                data: data
            });

            //ag.id,
            // ag.aluno,
            // ag.professor,
            // ta.nome AS tipo_aula,
            // ta.valor_hora,
            // ag.valor_final,
            // to_char(ag.data, 'DD/MM/YYYY') as data,
            // ag.duracao,
            // ag.horario_inicio,
            // ag.horario_fim

            return res.status(200).json({
                id: agend.id,
                aluno: agend.aluno,
                professor: agend.professor,
                valor_final: agend.valor_final,
                duracao: agend.duracao,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim,
                data: dayjs(agend.data).format('DD/MM/YYYY'),
                tipo_aula: aula.nome
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async editar(req, res) {
        try {

            const { id } = req.params;
            const { data, horario_inicio, horario_fim, tipo_aula_id, aluno, professor } = req.body;

            const agendamento = await Agendamento.findByPk(id);
            if (!agendamento) {
                return res.status(404).json('Agendamento não encontrado.');
            }

            const aula = await TipoAula.findByPk(tipo_aula_id);
            if (!aula) return res.status(404).json('Aula não encontrada.');

            const dados_horarios = verificaDadosHoras(horario_inicio, horario_fim, aula.valor_hora);
            if (dados_horarios.erro) return res.status(400).json(dados_horarios.msg);

            await agendamento.update({
                tipo_aula_id: aula.id,
                professor: professor,
                aluno: aluno,
                valor_final: dados_horarios.valor_total,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim,
                duracao: dados_horarios.duracao,
                data: data
            });

            return res.status(200).json({
                id: agendamento.id,
                aluno: agendamento.aluno,
                professor: agendamento.professor,
                valor_final: agendamento.valor_final,
                duracao: agendamento.duracao,
                horario_inicio: agendamento.horario_inicio,
                horario_fim: agendamento.horario_fim,
                data: dayjs(agendamento.data).format('DD/MM/YYYY'),
                tipo_aula: aula.nome
            });

        } catch (error) {
            return res.status(500).json('Erro interno ao atualizar o agendamento.');
        }
    },

    async deletar(req, res) {
        try {
            const agendamento_id = req.params.id;

            const agendamento = await Agendamento.findByPk(agendamento_id);

            if (!agendamento) return res.status(404).json({ msg: 'agendamento nao encontrado!' });

            await Agendamento.destroy({ where: { id: agendamento_id } });
            return res.status(200).json('agendamento excluido com sucesso');

        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async listar(req, res) {
        try {
            const agendamentos = await Agendamento.sequelize.query(`select 
                ag.id,
                ag.aluno,
                ag.professor,
                ta.nome AS tipo_aula,
                ta.valor_hora,
                ag.valor_final,
                to_char(ag.data, 'DD/MM/YYYY') as data,
                ag.duracao,
                ag.horario_inicio,
                ag.horario_fim

                from agendamento ag
                join tipo_aula ta on ta.id = ag.tipo_aula_id `, { type: QueryTypes.SELECT });

            return res.status(200).json(agendamentos);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },

    async buscar(req, res) {
        try {
            const agendamento_id = req.params.id;

            //const agendamento = await Agendamento.findByPK(agendamento_id);
            const agendamento = await Agendamento.sequelize.query(`
                select 
                ag.id,
                ag.aluno,
                ag.professor,
                ta.nome AS tipo_aula,
                ta.id as tipo_aula_id,
                ag.valor_final,
                ag.data,
                ag.duracao,
                ag.horario_inicio,
                ag.horario_fim

                from agendamento ag
                join tipo_aula ta on ta.id = ag.tipo_aula_id
                where ag.id =${agendamento_id}`, { type: QueryTypes.SELECT });

            if (!agendamento.length > 0) return res.status(404).json('Não encontrado');

            return res.status(200).json(agendamento[0]);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    },
};

export default agendamento;