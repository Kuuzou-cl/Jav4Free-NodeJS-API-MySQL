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

async function getCategory(id = 0) {
    const rows = await db.query(
        `SELECT * FROM Category WHERE id = ${id}`
    );
    const data = { Category : helper.emptyOrRows(rows)[0] };

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
    const maxRows = await db.query(
        `SELECT * from Scene s join SceneCategory sc on s.id = sc.sceneId where sc.categoryId = (SELECT c.id from Category c WHERE c.name = '${name}')`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const data = {Scenes : helper.emptyOrRows(rows)};
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        data,
        meta
    }
}

async function newCategory(name = 'error') {
    const rows = await db.query(
        `SELECT * FROM Category where name = '${name}'`
    );
    const data = { Categories : helper.emptyOrRows(rows) };

    if (data.Categories.length == 0) {
        const result = await db.query(
            `INSERT INTO Category (name) VALUES ('${name}')`
        );    
        const newRows = await db.query(
            `SELECT * FROM Category where id = '${result.insertId}'`
        );
        const newData = { Category : helper.emptyOrRows(newRows) };
        return {
            data: newData, meta: result
        }
    }else{
        return {
            error: 'Duplicated category name!'
        }
    }    
}

async function updateCategory(id= 0, name = 'error') {
    const rows = await db.query(
        `SELECT * FROM Category where id = ${id}`
    );
    const data = { Categories : helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM Category where name = '${name}'`
    );
    const data2 = { Categories : helper.emptyOrRows(rows2) };

    if (data.Categories.length > 0 && data2.Categories.length == 0) {
        const result = await db.query(
            `UPDATE Category set name ='${name}' WHERE id = ${id}`
        );    
        const newRows = await db.query(
            `SELECT * FROM Category where id = '${id}'`
        );
        const newData = { Category : helper.emptyOrRows(newRows) };
        return {
            data: newData, meta: result
        }
    }else{
        return {
            error: 'Duplicated category name or Id does not exist!'
        }
    }    
}

module.exports = {
    getAll,
    getCategory,
    getScenes,
    newCategory,
    updateCategory
}