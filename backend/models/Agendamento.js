import { DataTypes } from 'sequelize';
import banco from '../config/database.js';

const Agendamento = banco.define('agendamento', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    // pessoa representa o aluno
    aluno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    //professor que dara a aula
    professor: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    //aula do agendamento
    tipo_aula_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },

    horario_inicio: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    horario_fim: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    duracao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    valor_final: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
},
    {
        timestamps: false
    });

export default Agendamento;
