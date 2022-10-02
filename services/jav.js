const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageJavs);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Jav order by id ${order} LIMIT ${offset},${config.listPerPageJavs}`
    );
    const maxRows = await db.query(
        `SELECT * FROM Jav`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageJavs,maxRows.length);
    const data = { Javs : helper.emptyOrRows(rows) };
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        data,
        meta
    }
}

async function getNewest(limit = 1) {
    const rows = await db.query(
        `SELECT * FROM Jav order by id desc LIMIT 0,${limit}`
    );
    const data = 
    {
        Javs : helper.emptyOrRows(rows)
    };

    return{
        data
    }
}

async function getJav(code = 'AAA-000') {
    const rowsJav = await db.query(
        `SELECT * FROM Jav j where j.code = '${code}'`
    );
    const rowsCategories = await db.query(
        `SELECT * from Category c join JavCategory jc on c.id = jc.categoryId where jc.javId = (SELECT id FROM Jav j where j.code = '${code}')`
    );
    const rowsScenes = await db.query(
        `SELECT * FROM Scene s join JavScene js on js.sceneId = s.id where js.javId = (SELECT id FROM Jav j where j.code = '${code}')`
    );
    const data = {
        Jav : helper.emptyOrRows(rowsJav),
        Categories : helper.emptyOrRows(rowsCategories),
        Scenes : helper.emptyOrRows(rowsScenes)

    };
    return{
        data
    }
}

module.exports = {
    getMultiple,
    getNewest,
    getJav
}