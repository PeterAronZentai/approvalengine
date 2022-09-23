import { Sequelize, DataTypes, ModelOptions } from 'sequelize';

const options: ModelOptions = {
    timestamps: false,
    createdAt: false,
    updatedAt: false,        
}

export const getChangeRequestModel = (sequelize: Sequelize) =>  sequelize.define('ChangeRequest', {
    CRID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ClientId: {
        type: DataTypes.INTEGER
    },
    ChangeArea: {
        type: DataTypes.STRING
    },
    ChanteRequestPayload: {
        type: DataTypes.STRING
    },
}, { tableName: 'ChangeRequest', ...options });

