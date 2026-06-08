import { DataTypes } from 'sequelize';
import banco from '../config/database.js';

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
    },
     valor_hora: {
        type: DataTypes.NUMBER,
        allowNull: false,
    }
});



export default TipoAula;
