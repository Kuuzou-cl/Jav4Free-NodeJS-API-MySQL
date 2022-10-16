const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMostViewed(limit = 1) {
    const rows = await db.query(
        `select * from Scene s WHERE id in (select sceneId from SceneView sv group by sv.sceneId ORDER by count(sceneId) DESC) limit 0,${limit}`
    );
    const data = helper.emptyOrRows(rows);
    return{
        data
    }
}

async function getMultiple(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Scene order by id ${order} LIMIT ${offset},${config.listPerPageScenes}`
    );
    const maxRows = await db.query(
        `SELECT * FROM Scene`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const data = {Scenes : helper.emptyOrRows(rows)};
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        data,
        meta
    }
}

async function getScene(code = 'AAA-000_001') {
    const rowsScene = await db.query(
        `SELECT * FROM Scene s where s.code = '${code}'`
    );
    const rowsCategories = await db.query(
        `SELECT * from Category c join SceneCategory sc on c.id = sc.categoryId where sc.sceneId  = (SELECT id FROM Scene s where s.code = '${code}')`
    );
    const rowsJav = await db.query(
        `Select * from Jav j join JavScene js on j.id = js.javId where js.sceneId = (SELECT id FROM Scene s where s.code = '${code}')`
    );
    const rowsIdols = await db.query(
        `Select * from Idol i join SceneIdol si on i.id = si.idolId  where si.sceneId = (SELECT id FROM Scene s where s.code = '${code}')`
    );
    const data = 
    {
        Scene: helper.emptyOrRows(rowsScene),
        Categories : helper.emptyOrRows(rowsCategories),
        Jav : helper.emptyOrRows(rowsJav),
        Idols : helper.emptyOrRows(rowsIdols)
    };

    return {
        data
    }
}

module.exports = {
    getMostViewed,
    getMultiple,
    getScene
}