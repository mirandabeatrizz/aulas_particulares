import { Op, QueryTypes } from 'sequelize';
import Agendamento from '../models/Agendamento.js';
import Aula from '../models/Aula.js';
import Pessoa from '../models/Pessoa.js';
import Professor from '../models/Professor.js';
import pessoa from './PessoaController.js';

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
            const { data, horario_inicio, horario_fim, aula_id, aluno_id, professor_pessoa_id } = req.body;

            if (aluno_id === professor_pessoa_id) return res.status(500).json('Aluno e professor não podem ser a mesma pessoa.');

            //verificar se a aula para qual esta tentando criar um agendamento existe
            const aula = await Aula.findByPk(aula_id);

            // se nao tiver a aula ja retorna
            if (!aula) return res.status(404).json('Aula não encontrada.');

            const dados_horarios = verificaDadosHoras(horario_inicio, horario_fim, aula.valor_hora)

            if (dados_horarios.erro) return res.status(400).json(dados_horarios.msg)

            const pessoas = await Pessoa.findAll({
                where: {
                    id: {
                        [Op.in]: [aluno_id, professor_pessoa_id]
                    }
                }
            });

            // verifica se encontrou as pessoas
            if (pessoas.length === 0) {
                return res.status(404).json('Pessoas não encontradas para fazer o agendamento');
            }

            let professorid = null;
            let alunoid = null;

            for (const pessoa of pessoas) {
                if (pessoa.id == professor_pessoa_id) {

                    const professor = await Professor.findOne({ where: { pessoa_id: professor_pessoa_id } });

                    if (!professor) {
                        return res.status(404).json('Professor informado não foi encontrado, verifique e tente novamente');
                    }
                    professorid = professor.id;

                } else if (pessoa.id == aluno_id) {
                    alunoid = pessoa.id;
                }
            }

            if (!professorid || !alunoid) {
                return res.status(400).json('Aluno ou professor não possuem os vínculos corretos.');
            }

            await Agendamento.create({
                aula_id: aula.id,
                professor_id: professorid,
                pessoa_id: alunoid,
                valor_final: dados_horarios.valor_total,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim,
                duracao: dados_horarios.duracao,
                data: data
            });

            return res.status(200).json('Sucesso')
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async editar(req, res) {
        try {

            const { id } = req.params;
            const { data, horario_inicio, horario_fim, aula_id, aluno_id, professor_pessoa_id } = req.body;

            const agendamento = await Agendamento.findByPk(id);
            if (!agendamento) {
                return res.status(404).json('Agendamento não encontrado.');
            }

            if (aluno_id === professor_pessoa_id) {
                return res.status(400).json('Aluno e professor não podem ser a mesma pessoa.');
            }

            const aula = await Aula.findByPk(aula_id);
            if (!aula) return res.status(404).json('Aula não encontrada.');

            const dados_horarios = verificaDadosHoras(horario_inicio, horario_fim, aula.valor_hora);
            if (dados_horarios.erro) return res.status(400).json(dados_horarios.msg);

            const pessoas = await Pessoa.findAll({
                where: {
                    id: {
                        [Op.in]: [aluno_id, professor_pessoa_id]
                    }
                }
            });

            if (pessoas.length === 0) {
                return res.status(404).json('Pessoas não encontradas para fazer a atualização.');
            }

            let professorid = null;
            let alunoid = null;

            for (const pessoa of pessoas) {
                if (pessoa.id == professor_pessoa_id) {
                    const professor = await Professor.findOne({ where: { pessoa_id: professor_pessoa_id } });

                    if (!professor) {
                        return res.status(404).json('Professor informado não foi encontrado, verifique e tente novamente');
                    }
                    professorid = professor.id;

                } else if (pessoa.id == aluno_id) {
                    alunoid = pessoa.id;
                }
            }

            if (!professorid || !alunoid) {
                return res.status(400).json('Aluno ou professor não possuem os vínculos corretos.');
            }

            await agendamento.update({
                aula_id: aula.id,
                professor_id: professorid,
                pessoa_id: alunoid,
                valor_final: dados_horarios.valor_total,
                horario_inicio: horario_inicio,
                horario_fim: horario_fim,
                duracao: dados_horarios.duracao,
                data: data
            });

            return res.status(200).json('Agendamento atualizado com sucesso!');

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
                aluno.nome AS nome_aluno,
                nome_prof.nome AS nome_professor,
                ta.nome AS tipo_aula,
                au.valor_hora,
                ag.valor_final AS valor_total,
                to_char(ag.data, 'DD/MM/YYYY') as data,
                ag.duracao,
                ag.horario_inicio,
                ag.horario_fim

                from agendamento ag

                join professor prof on prof.id = ag.professor_id
                join pessoa nome_prof on nome_prof.id = prof.pessoa_id 
                join aula au on au.id = ag.aula_id 
                join tipo_aula ta on ta.id = au.tipo_id
                join pessoa aluno on aluno.id = ag.pessoa_id `, { type: QueryTypes.SELECT });

            return res.status(200).json(agendamentos);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    async buscar(req, res) {
        try {
            const agendamento_id = req.params.id;

            //const agendamento = await Agendamento.findByPK(agendamento_id);
            const agendamento = await Agendamento.sequelize.query(`select 
                aluno.nome AS nome_aluno,
                nome_prof.nome AS nome_professor,
                ta.nome AS tipo_aula,
                au.valor_hora,
                ag.valor_final AS valor_total,
                to_char(ag.data, 'DD/MM/YYYY') as data,
                ag.duracao,
                ag.horario_inicio,
                ag.horario_fim

                from agendamento ag

                join professor prof on prof.id = ag.professor_id
                join pessoa nome_prof on nome_prof.id = prof.pessoa_id 
                join aula au on au.id = ag.aula_id 
                join tipo_aula ta on ta.id = au.tipo_id
                join pessoa aluno on aluno.id = ag.pessoa_id 
                where ag.id =${agendamento_id}`, { type: QueryTypes.SELECT });

            if (!agendamento.length > 0) return res.status(404).json('Não encontrado');

            return res.status(200).json(agendamento);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
};

export default agendamento;