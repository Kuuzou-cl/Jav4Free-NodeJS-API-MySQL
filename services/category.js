const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAll() {
    const rows = await db.query(
        `SELECT * FROM Category order by name`
    );
    const data = { Categories : helper.emptyOrRows(rows) };

    return {
        data
    }
}

async function getScenes(page = 1, name = '', order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * from Scene s join SceneCategory sc on s.id = sc.sceneId where sc.categoryId = (SELECT c.id from Category c WHERE c.name = '${name}') order by s.creation ${order} LIMIT ${offset},${config.listPerPageScenes}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

module.exports = {
    getAll,
    getScenes
}