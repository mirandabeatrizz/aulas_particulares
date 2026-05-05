import { DataTypes } from 'sequelize';
import banco from '../config/database.js';
import Aula from './Aula.js';

const TipoAula = banco.define('tipo_aula', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});



export default TipoAula;
