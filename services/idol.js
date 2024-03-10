const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getRandomByLimit(limit = 1) {
    const rows = await db.query(
        `SELECT i.*, count(ji.idol_id) as quantity FROM jav.idol i JOIN jav_idol ji on ji.idol_id = i.id GROUP by i.id order by RAND() LIMIT 0,${limit}`
    );
    return{
        Response: helper.emptyOrRows(rows)
    }
}

async function getbypage(page = 1) {
    const offset = helper.getOffset(page, config.listPerPageIdols);

    const rows = await db.query(
        `SELECT i.* FROM jav.idol i JOIN jav_idol ji on ji.idol_id = i.id GROUP by i.id order by i.name LIMIT ${offset},${config.listPerPageIdols}`
    );
    const maxRows = await db.query(
        `SELECT i.* FROM jav.idol i JOIN jav_idol ji on ji.idol_id = i.id GROUP by i.id`
    );

    const pagesData = helper.getCountPages(page,config.listPerPageIdols,maxRows.length);

    return {
        Response:{
            Idols: helper.emptyOrRows(rows),
            page: page,
            nextPage: pagesData.nextPage, 
            lastPage: pagesData.lastPage
        }
    }
}

async function getJavByIdol(page = 1, name = '') {
    const offset = helper.getOffset(page, config.listPerPageScenes);

    const rows = await db.query(
        `SELECT * FROM jav.jav j join jav.jav_idol ji on j.id = ji.jav_id where ji.idol_id = (SELECT id FROM jav.idol i where i.name = '${name}') order by j.release_date desc LIMIT ${offset},${config.listPerPageScenes}`
    );

    const rows2 = await db.query(
        `SELECT * FROM idol i where i.name = '${name}'`
    );

    const maxRows = await db.query(
        `SELECT * FROM jav.jav j join jav.jav_idol ji on j.id = ji.jav_id where ji.idol_id = (SELECT id FROM jav.idol i where i.name = '${name}')`
    );
    
    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);

    return {
        Response:{
            Idol: helper.emptyOrRows(rows2[0]),
            Javs: helper.emptyOrRows(rows),
            page: page,
            nextPage: pagesData.nextPage, 
            lastPage: pagesData.lastPage
        }
        
    }
}

async function getAll() {
    const rows = await db.query(
        `SELECT * FROM jav.idol i order by i.name`
    );

    return {
        Response: helper.emptyOrRows(rows)
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
    getAll,
    //
    newIdolV2,
    updateIdolV2
}