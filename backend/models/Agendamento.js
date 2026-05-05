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
    pessoa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    //professor que dara a aula
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    //aula do agendamento
    aula_id: {
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

    valor_final: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
},
    {
        timestamps: false
    });

export default Agendamento;
