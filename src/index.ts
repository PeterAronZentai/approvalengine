import express from 'express';

import { sequelize, Client, ChangeRequest, ApprovalResponse } from './db';

type Change = {
    field: string;
    newValue: string | number;
}

type ChangeResult = {
    field: string;
    accepted: boolean;
}

const app = express();
app.use(express.json());


app.get('/client/:id', async (req, res) => {
    const { date } = req.query
    // sql injection possible - risks accepted
    const sqlQuery = `select * from Client ${date ? ` FOR SYSTEM_TIME as of '${date}'` : ''} where CID = ${req.params.id}`
    const result = await sequelize.query(sqlQuery);
    res.json(result);    
})

app.post('/change-request', async (req, res) => {
    const { clientId: ClientId, area: ChangeArea } = req.body;
    const cr = await ChangeRequest.create({
        ClientId,
        ChangeArea,
        ChanteRequestPayload: JSON.stringify(req.body),
    })
    res.json(cr);
})

app.get('/change-request', async (req, res) => {
    const [ result ] = await sequelize.query(
        `SELECT cr.* FROM ChangeRequest cr 
        LEFT OUTER JOIN ApprovalResponse ar on cr.CRID = ar.CRID where ar.ARID is null`);
    res.json(result);
})

app.post('/approval-response', async(req, res) => {
    const { requestId } = req.body;
    const cr = await <any>ChangeRequest.findByPk(requestId);    
    if (!cr) {
        return res.status(500).json({ 'error': 'no such change request' })
    }

    const  { ClientId, ChangeArea, ChanteRequestPayload } = cr;
    const crObj = JSON.parse(ChanteRequestPayload);
    const approvalPayload = req.body;
    const respondedChanges = approvalPayload.changes as ChangeResult[];

    const approvedItems = respondedChanges.filter(c => c.accepted).map(c => c.field);
    const approvedChanges = crObj.changes.filter((c:any) => approvedItems.includes(c.field))
    console.log({ approvedItems, approvedChanges })
   
    //invoke the service that writes Client db record. inlined in this POC
    await applyChanges(ClientId, approvedChanges);
    //endinvoke

    await ApprovalResponse.create({ CRID: requestId, ApprovalResponsePayload: JSON.stringify(req.body)})

    const respondedItems = respondedChanges.map((c:any) => c.field);
    const undecidedChanges = crObj.changes.filter((c:any) => !respondedItems.includes(c.field))
    if (undecidedChanges.length) {
        const newChangeRequest = { ...crObj, changes: undecidedChanges }
        const newCrPersisted = await ChangeRequest.create({
            ClientId,
            ChangeArea,
            ChanteRequestPayload: JSON.stringify(newChangeRequest),
        })
        return res.json({ ok: true, created: newCrPersisted })
    }

    res.json({ ok: true});
})

async function applyChanges(clientId: number, changes: Change[]) {
    const client = await Client.findByPk(clientId);
    if (!client) {
        throw new Error(`Invalid client id ${clientId}`);
    }
    changes.forEach(({ field, newValue }) => client.setDataValue(field, newValue));
    await client.save();
}

async function startup() {
    try {
        await sequelize.authenticate();
        const server  = app.listen(4999, () => {
            console.log(server.address())
        })
    } catch(e) {
        console.error(e);
    }
}

startup().then(console.log);