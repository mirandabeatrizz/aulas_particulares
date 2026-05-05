import { DataTypes } from 'sequelize';
import banco from '../config/database.js';

const Professor = banco.define('professor', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    pessoa_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    cnd:{
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Professor;
