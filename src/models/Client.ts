import { Sequelize, DataTypes, ModelOptions } from 'sequelize';

const options: ModelOptions = {
    timestamps: false,
    createdAt: false,
    updatedAt: false,        
}

export function getClientModel(sequelize: Sequelize) {
    const Client = sequelize.define('Client', {
        CID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        GID: {
            type: DataTypes.INTEGER
        },
        ANumericalValue: {
            type: DataTypes.NUMBER
        },
        Name: {
            type: DataTypes.STRING
        },
        RealName: {
            type: DataTypes.STRING
        },
    }, { tableName: 'Client', ...options });
    return Client;
};
