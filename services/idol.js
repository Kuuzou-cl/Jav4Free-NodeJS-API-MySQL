const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageIdols);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Idol order by id ${order} LIMIT ${offset},${config.listPerPageIdols}`
    );
    const maxRows = await db.query(
        `SELECT * FROM Idol`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageIdols,maxRows.length);
    const data = {Idols:helper.emptyOrRows(rows)};
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

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

async function getAll() {
    const rows = await db.query(
        `SELECT * FROM Idol order by name`
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
    const rows2 = await db.query(
        `SELECT * FROM Idol i where i.name = '${name}'`
    );
    const data = {
        Idol: helper.emptyOrRows(rows2),
        Scenes :helper.emptyOrRows(rows)
    };

    const maxRows = await db.query(
        `SELECT * FROM Scene s join SceneIdol si on s.id = si.sceneId where si.idolId = (SELECT id FROM Idol i where i.name = '${name}')`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        data,
        meta
    }
}

async function newIdol(name = 'error', image = 'error', hide = true) {
    const rows = await db.query(
        `SELECT * FROM Idol where name = '${name}'`
    );
    const data = { Idols : helper.emptyOrRows(rows) };

    if (data.Idols.length == 0) {
        const result = await db.query(
            `INSERT INTO Idol (name, image, hide) VALUES ('${name}','${image}',${hide})`
        );    
        const newRows = await db.query(
            `SELECT * FROM Idol where id = '${result.insertId}'`
        );
        const newData = { Idol : helper.emptyOrRows(newRows) };
        return {
            data: newData, meta: result
        }
    }else{
        return {
            error: 'Duplicated idol name!'
        }
    }    
}

async function getIdol(id = 0) {
    const rows = await db.query(
        `SELECT * FROM Idol WHERE id = ${id}`
    );
    const data = { Idol : helper.emptyOrRows(rows)[0] };

    return {
        data
    }
}

async function updateIdol(id= 0, name = 'error', image = 'error') {
    const rows = await db.query(
        `SELECT * FROM Idol where id = ${id}`
    );
    const data = { Idols : helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM Idol where name = '${name}'`
    );
    const data2 = { Idols : helper.emptyOrRows(rows2) };

    if (data.Idols.length > 0 && data2.Idols.length == 0) {
        const result = await db.query(
            `UPDATE Idol set name ='${name}', image = '${image}' WHERE id = ${id}`
        );    
        const newRows = await db.query(
            `SELECT * FROM Idol where id = '${id}'`
        );
        const newData = { Idol : helper.emptyOrRows(newRows) };
        return {
            data: newData, meta: result
        }
    }else{
        return {
            error: 'Duplicated idol name or Id does not exist!'
        }
    }    
}

module.exports = {
    getMultiple,
    getFeatured,
    getScenes,
    getAll,
    newIdol,
    getIdol,
    updateIdol
}