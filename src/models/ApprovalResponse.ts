import { Sequelize, DataTypes, ModelOptions } from 'sequelize';

const options: ModelOptions = {
    timestamps: false,
    createdAt: false,
    updatedAt: false,        
}

export const getApprovalResponseModel = (sequelize: Sequelize) =>  sequelize.define('ApprovalResponse', {
    ARID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CRID: {
        type: DataTypes.INTEGER,
    },
    ApprovalResponsePayload: {
        type: DataTypes.STRING
    },
}, { tableName: 'ApprovalResponse', ...options });

