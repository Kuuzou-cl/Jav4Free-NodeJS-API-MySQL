const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageJavs);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Idol order by id ${order} LIMIT ${offset},${config.listPerPageJavs}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getFeatured(limit = 1) {
    const rows = await db.query(
        `SELECT * FROM Idol order by RAND() LIMIT 0,${limit}`
    );
    const data = {Idols: helper.emptyOrRows(rows)};
    return{
        data
    }
}

async function getScenes(page = 1, name = '', order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Scene s join SceneIdol si on s.id = si.sceneId where si.idolId = (SELECT id FROM Idol i where i.name = '${name}') order by s.creation ${order} LIMIT ${offset},${config.listPerPageScenes}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

module.exports = {
    getMultiple,
    getFeatured,
    getScenes
}