import { DataTypes } from 'sequelize';
import banco from '../config/database.js';
import TipoAula from './TipoAula.js';

const Aula = banco.define('aula', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tipo_aula', // Nome da tabela no banco
            key: 'id',
        },
    },
});



export default Aula;