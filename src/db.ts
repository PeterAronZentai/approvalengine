import { Sequelize } from 'sequelize';

import { getClientModel } from './models/Client';
import { getChangeRequestModel } from './models/ChangeRequest';
import { getApprovalResponseModel } from './models/ApprovalResponse';



export const sequelize = new Sequelize('zeetemporal-db', 'zee', process.env.PASSWORD, {
    host: 'zeetemporal-server.database.windows.net',
    port: 1433,
    dialect: 'mssql',
});

export const Client = getClientModel(sequelize);
export const ChangeRequest = getChangeRequestModel(sequelize);
export const ApprovalResponse = getApprovalResponseModel(sequelize);
