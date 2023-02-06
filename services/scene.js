const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMostViewed(limit = 1) {
    const rows = await db.query(
        `SELECT s.*, COUNT(sv.sceneId) as totalViews  from SceneView sv join Scene s ON sv.sceneId = s.id GROUP by sv.sceneId order by totalViews desc limit 0,${limit}`
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
        `SELECT * FROM Scene WHERE hide = 0  order by id ${order} LIMIT ${offset},${config.listPerPageScenes}`
    );
    const maxRows = await db.query(
        `SELECT * FROM Scene WHERE hide = 0 `
    );
    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const data = {Scenes : helper.emptyOrRows(rows)};
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        data,
        meta
    }
}

async function getScenes(limit = 1, order = 'desc') {
    const rows = await db.query(
        `SELECT * FROM Scene WHERE hide = 0  order by id ${order} LIMIT 0,${limit}`
    );
    const data = {Scenes : helper.emptyOrRows(rows)};
    return {
        data
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

async function getSceneId(id = 0) {
    const rowsScene = await db.query(
        `SELECT * FROM Scene s where s.id = ${id}`
    );
    const rowsCategories = await db.query(
        `SELECT * from Category c join SceneCategory sc on c.id = sc.categoryId where sc.sceneId  = ${id}`
    );
    const rowsIdols = await db.query(
        `Select * from Idol i join SceneIdol si on i.id = si.idolId  where si.sceneId = ${id}`
    );
    const data = 
    {
        Scene: helper.emptyOrRows(rowsScene[0]),
        Categories : helper.emptyOrRows(rowsCategories),
        Idols : helper.emptyOrRows(rowsIdols)
    };

    return {
        data
    }
}

async function getAll() {
    const rows = await db.query(
        `select * from Scene s order by code`
    );
    const data = {Scenes: helper.emptyOrRows(rows)};
    return{
        data
    }
}

async function newScene(title = 'error', code = 'error', video = 'error', duration = 'error', hide = 1, previewImage = '', staticImage = '', vtt = '', video480p = '', categories = [],idols = []) {
    const rows = await db.query(
        `SELECT * FROM Scene where code = '${code}'`
    );
    const data = { Scenes : helper.emptyOrRows(rows) };

    const arrayString = code.split('_');

    const javFind = await db.query(
        `SELECT * FROM Jav where code = '${arrayString[0]}'`
    );

    const dataJav = { Jav : helper.emptyOrRows(javFind) };

    if (data.Scenes.length == 0 && dataJav.Jav.length > 0) {
        
        const result = await db.query(
            `INSERT INTO Scene (title,code,video,duration,hide,previewImage,staticImage,vtt,video480p) VALUES ('${title}','${code}','${video}','${duration}',${hide},'${previewImage}','${staticImage}','${vtt}','${video480p}')`
        );    
        const newRows = await db.query(
            `SELECT * FROM Scene where id = '${result.insertId}'`
        );
        
        const newData = { Scene : helper.emptyOrRows(newRows) };

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO SceneCategory (sceneId,categoryId) VALUES (${result.insertId},${category})`
            ); 
        });

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO SceneIdol (sceneId,idolId) VALUES (${result.insertId},${idol})`
            ); 
        });

        const javFind = await db.query(
            `INSERT INTO JavScene (javId, sceneId) VALUES (${dataJav.Jav[0].id},${result.insertId})`
        );

        return {
            data: newData, meta: result
        }
    }else{
        return {
            error: 'Duplicated Scene code!'
        }
    }    
}

async function deleteScene(code = 'error') {
    const rows = await db.query(
        `SELECT * FROM Scene where code = '${code}'`
    );
    const data = { Scenes : helper.emptyOrRows(rows) };

    if (data.Scenes.length == 1) {
        const result = await db.query(
            `DELETE FROM Scene WHERE code = '${code}'`
        );    
        return {
            meta: result
        }
    }else{
        return {
            error: 'Scene code does not exist or it is not unique!'
        }
    }    
}

async function updateScene(id = 0, title = 'error', code = 'error', video = 'error', duration = 'error', hide = 1, previewImage = '', staticImage = '', vtt = '', video480p = '', categories = [],idols = []) {    
    const rows = await db.query(
        `SELECT * FROM Scene where id = ${id}`
    );
    const data = { Scenes : helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM Scene where code = '${code}'`
    );
    const data2 = { Scenes : helper.emptyOrRows(rows2) };

    if (data.Scenes.length > 0 && (data2.Scenes.length == 0 || data.Scenes[0].id == data2.Scenes[0].id)) {
        const result = await db.query(
            `UPDATE Scene set title = '${title}', code = '${code}', video = '${video}', duration = '${duration}', hide = ${hide}, previewImage = '${previewImage}', staticImage = '${staticImage}', vtt = '${vtt}', video480p = '${video480p}' WHERE id = ${id}`
        );    
        const newRows = await db.query(
            `SELECT * FROM Scene where id = ${id}`
        );
        
        const newData = { Scene : helper.emptyOrRows(newRows) };

        const deleteCategories = await db.query(
            `DELETE FROM SceneCategory WHERE sceneId = ${id}`
        );    

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO SceneCategory (sceneId,categoryId) VALUES (${id},${category.id})`
            ); 
        });

        const deleteIdol = await db.query(
            `DELETE FROM SceneIdol WHERE sceneId = ${id}`
        );    

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO SceneIdol (sceneId,idolId) VALUES (${id},${idol.id})`
            ); 
        });
        
        return {
            data: newData, meta: result
        }
    }else{
        return {
            error: 'Duplicated Scene code or ID does not exist!'
        }
    }    
}

async function getView(id = 0) {
    const rows = await db.query(
        `INSERT INTO SceneView (sceneId) VALUES (${id})`
    );
    const data = helper.emptyOrRows(rows);
    return{
        data
    }
}

module.exports = {
    getMostViewed,
    getMultiple,
    getScene,
    getScenes,
    getSceneId,
    getAll,
    newScene,
    deleteScene,
    updateScene,
    getView
}