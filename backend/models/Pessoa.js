import { DataTypes } from 'sequelize';
import banco from '../config/database.js';

const Pessoa = banco.define('pessoa', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Pessoa;
