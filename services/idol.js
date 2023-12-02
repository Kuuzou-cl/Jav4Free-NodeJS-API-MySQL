const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const dotenv = require('dotenv').config();
const cloudfrontSigner = require('@aws-sdk/cloudfront-signer');

async function getRandomByLimit(limit = 1) {
    const rows = await db.query(
        `SELECT * FROM idol order by RAND() LIMIT 0,${limit}`
    );
    return{
        Idols: helper.emptyOrRows(rows)
    }
}

async function getbypage(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageIdols);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM idol order by id ${order} LIMIT ${offset},${config.listPerPageIdols}`
    );
    const maxRows = await db.query(
        `SELECT * FROM idol`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageIdols,maxRows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        Idols:helper.emptyOrRows(rows),
        meta
    }
}

async function getJavByIdol(page = 1, name = '', order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM jav j join jav_idol ji on j.id = ji.jav_id where ji.idol_id = (SELECT id FROM idol i where i.name = '${name}') order by j.id ${order} LIMIT ${offset},${config.listPerPageScenes}`
    );

    const tempId = []
    rows.forEach(element => {
        tempId.push(element.id);
    });

    let rowsCategories = [];

    for (let index = 0; index < tempId.length; index++) {
        rowsCategories.push(helper.emptyOrRows(await db.query(
            `SELECT c.id, c.name FROM category c join jav_category jc on c.id = jc.category_id and jc.jav_id = ${tempId[index]} ORDER BY RAND() LIMIT 0,3`
        )));
    }

    for (let index = 0; index < rows.length; index++) {
        rows[index].categories = rowsCategories[index];
    }

    const rows2 = await db.query(
        `SELECT * FROM idol i where i.name = '${name}'`
    );

    const maxRows = await db.query(
        `SELECT * FROM jav j join jav_idol ji on j.id = ji.jav_id where ji.idol_id = (SELECT id FROM idol i where i.name = '${name}')`
    );
    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        Idol: helper.emptyOrRows(rows2[0]),
        Javs :helper.emptyOrRows(rows),
        meta
    }
}

//--------------------------------------------------------------------




async function newIdolV2(name = 'error', image = 'error', hide = true) {
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
        return {
            Idol : helper.emptyOrRows(newRows), meta: result
        }
    }else{
        return {
            error: 'Duplicated idol name!'
        }
    }    
}

async function updateIdolV2(id= 0, name = 'error', image = 'error') {
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
        return {
            Idol : helper.emptyOrRows(newRows), meta: result
        }
    }else{
        return {
            error: 'Duplicated idol name or Id does not exist!'
        }
    }    
}

module.exports = {
    getRandomByLimit,
    getbypage,
    getJavByIdol,
    //
    newIdolV2,
    updateIdolV2
}