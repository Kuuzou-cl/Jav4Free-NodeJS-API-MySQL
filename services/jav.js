const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageJavs);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Jav WHERE hide = 0 order by id ${order} LIMIT ${offset},${config.listPerPageJavs}`
    );
    const maxRows = await db.query(
        `SELECT * FROM Jav WHERE hide = 0 `
    );
    const pagesData = helper.getCountPages(page, config.listPerPageJavs, maxRows.length);
    const data = { Javs: helper.emptyOrRows(rows) };
    const meta = { page: page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        data,
        meta
    }
}

async function getMultipleV2(page = 1, order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageJavs);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM Jav WHERE hide = 0 order by id ${order} LIMIT ${offset},${config.listPerPageJavs}`
    );

    const tempId = []
    rows.forEach(element => {
        tempId.push(element.id);
    });

    let rowsCategories = [];

    for (let index = 0; index < tempId.length; index++) {
        rowsCategories.push(helper.emptyOrRows(await db.query(
            `SELECT c.id, c.name FROM Category c join JavCategory jc on c.id = jc.categoryId and jc.javId = ${tempId[index]} ORDER BY RAND() LIMIT 0,3`
        )));
    }

    for (let index = 0; index < rows.length; index++) {
        rows[index].categories = rowsCategories[index];
    }

    const maxRows = await db.query(
        `SELECT * FROM Jav WHERE hide = 0 `
    );
    const pagesData = helper.getCountPages(page, config.listPerPageJavs, maxRows.length);
    const meta = { page: page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        Javs: helper.emptyOrRows(rows),
        meta
    }
}

async function getNewest(limit = 1) {
    const rows = await db.query(
        `SELECT * FROM Jav WHERE hide = 0 order by id desc LIMIT 0,${limit}`
    );
    const data =
    {
        Javs: helper.emptyOrRows(rows)
    };

    return {
        data
    }
}

async function getNewestV2(limit = 1) {
    const rows = await db.query(
        `SELECT * FROM Jav WHERE hide = 0 order by id desc LIMIT 0,${limit}`
    );

    const tempId = []
    rows.forEach(element => {
        tempId.push(element.id);
    });

    let rowsCategories = [];

    for (let index = 0; index < tempId.length; index++) {
        rowsCategories.push(helper.emptyOrRows(await db.query(
            `SELECT c.id, c.name FROM Category c join JavCategory jc on c.id = jc.categoryId and jc.javId = ${tempId[index]} ORDER BY RAND() LIMIT 0,3`
        )));
    }

    for (let index = 0; index < rows.length; index++) {
        rows[index].categories = rowsCategories[index];
    }

    return {
        Javs: helper.emptyOrRows(rows)
    }
}

async function getAll() {
    const rows = await db.query(
        `SELECT * FROM Jav order by code`
    );
    const data =
    {
        Javs: helper.emptyOrRows(rows)
    };

    return {
        data
    }
}

async function getAllV2() {
    const rows = await db.query(
        `SELECT * FROM Jav order by code`
    );

    return {
        Javs: helper.emptyOrRows(rows)
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
        `SELECT * FROM Scene s join JavScene js on js.sceneId = s.id where js.javId = (SELECT id FROM Jav j where j.code = '${code}') and s.hide = 0 `
    );
    const rowsIdols = await db.query(
        `SELECT * from Idol i join JavIdol ji on ji.idolId = i.id WHERE ji.javId = (SELECT id FROM Jav j where j.code = '${code}')`
    );
    const data = {
        Jav: helper.emptyOrRows(rowsJav),
        Categories: helper.emptyOrRows(rowsCategories),
        Scenes: helper.emptyOrRows(rowsScenes),
        Idols: helper.emptyOrRows(rowsIdols)
    };
    return {
        data
    }
}

async function getJavV2(code = 'AAA-000') {
    const rowsJav = await db.query(
        `SELECT * FROM Jav j where j.code = '${code}'`
    );
    const rowsCategories = await db.query(
        `SELECT * from Category c join JavCategory jc on c.id = jc.categoryId where jc.javId = (SELECT id FROM Jav j where j.code = '${code}')`
    );
    const rowsScenes = await db.query(
        `SELECT * FROM Scene s join JavScene js on js.sceneId = s.id where js.javId = (SELECT id FROM Jav j where j.code = '${code}') and s.hide = 0 `
    );
    const rowsIdols = await db.query(
        `SELECT * from Idol i join JavIdol ji on ji.idolId = i.id WHERE ji.javId = (SELECT id FROM Jav j where j.code = '${code}')`
    );
    return {
        Jav: helper.emptyOrRows(rowsJav),
        Categories: helper.emptyOrRows(rowsCategories),
        Scenes: helper.emptyOrRows(rowsScenes),
        Idols: helper.emptyOrRows(rowsIdols)
    }
}

async function getJavId(id = 0) {
    const rowsJav = await db.query(
        `SELECT * FROM Jav j where j.id = ${id}`
    );
    const rowsCategories = await db.query(
        `SELECT * from Category c join JavCategory jc on c.id = jc.categoryId where jc.javId = ${id}`
    );
    const rowsScenes = await db.query(
        `SELECT * FROM Scene s join JavScene js on js.sceneId = s.id where js.javId = ${id}`
    );
    const rowsIdols = await db.query(
        `SELECT * from Idol i join JavIdol ji on ji.idolId = i.id WHERE ji.javId = ${id}`
    );
    const data = {
        Jav: helper.emptyOrRows(rowsJav[0]),
        Categories: helper.emptyOrRows(rowsCategories),
        Scenes: helper.emptyOrRows(rowsScenes),
        Idols: helper.emptyOrRows(rowsIdols)
    };
    return {
        data
    }
}

async function getJavIdV2(id = 0) {
    const rowsJav = await db.query(
        `SELECT * FROM Jav j where j.id = ${id}`
    );
    const rowsCategories = await db.query(
        `SELECT * from Category c join JavCategory jc on c.id = jc.categoryId where jc.javId = ${id}`
    );
    const rowsScenes = await db.query(
        `SELECT * FROM Scene s join JavScene js on js.sceneId = s.id where js.javId = ${id}`
    );
    const rowsIdols = await db.query(
        `SELECT * from Idol i join JavIdol ji on ji.idolId = i.id WHERE ji.javId = ${id}`
    );

    return {
        Jav: helper.emptyOrRows(rowsJav[0]),
        Categories: helper.emptyOrRows(rowsCategories),
        Scenes: helper.emptyOrRows(rowsScenes),
        Idols: helper.emptyOrRows(rowsIdols)
    }
}

async function newJav(title = 'error', code = 'error', image = 'error', hide = 1, categories = [], idols = []) {
    const rows = await db.query(
        `SELECT * FROM Jav where code = '${code}'`
    );
    const data = { Javs: helper.emptyOrRows(rows) };

    if (data.Javs.length == 0) {
        const result = await db.query(
            `INSERT INTO Jav (title,code,image,hide) VALUES ('${title}','${code}','${image}',${hide})`
        );
        const newRows = await db.query(
            `SELECT * FROM Jav where id = '${result.insertId}'`
        );

        const newData = { Jav: helper.emptyOrRows(newRows) };

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO JavCategory (javId,categoryId) VALUES (${result.insertId},${category})`
            );
        });

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO JavIdol (javId,idolId) VALUES (${result.insertId},${idol})`
            );
        });
        return {
            data: newData, meta: result
        }
    } else {
        return {
            error: 'Duplicated Jav code!'
        }
    }
}

async function newJavV2(title = 'error', code = 'error', image = 'error', hide = 1, categories = [], idols = []) {
    const rows = await db.query(
        `SELECT * FROM Jav where code = '${code}'`
    );
    const data = { Javs: helper.emptyOrRows(rows) };

    if (data.Javs.length == 0) {
        const result = await db.query(
            `INSERT INTO Jav (title,code,image,hide) VALUES ('${title}','${code}','${image}',${hide})`
        );
        const newRows = await db.query(
            `SELECT * FROM Jav where id = '${result.insertId}'`
        );

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO JavCategory (javId,categoryId) VALUES (${result.insertId},${category})`
            );
        });

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO JavIdol (javId,idolId) VALUES (${result.insertId},${idol})`
            );
        });
        return {
            Jav: helper.emptyOrRows(newRows), meta: result
        }
    } else {
        return {
            error: 'Duplicated Jav code!'
        }
    }
}

async function updateJav(id = 0, title = 'error', code = 'error', image = 'error', hide = 1, categories = [], idols = [], scenes = []) {
    const rows = await db.query(
        `SELECT * FROM Jav where id = ${id}`
    );
    const data = { Javs: helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM Jav where code = '${code}'`
    );
    const data2 = { Javs: helper.emptyOrRows(rows2) };

    if (data.Javs.length > 0 && (data2.Javs.length == 0 || data.Javs[0].id == data2.Javs[0].id)) {
        const result = await db.query(
            `UPDATE Jav set title = '${title}', code = '${code}', image = '${image}', hide = ${hide} WHERE id = ${id}`
        );
        const newRows = await db.query(
            `SELECT * FROM Jav where id = ${id}`
        );

        const newData = { Jav: helper.emptyOrRows(newRows) };

        const deleteCategories = await db.query(
            `DELETE FROM JavCategory WHERE javId = ${id}`
        );

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO JavCategory (javId,categoryId) VALUES (${id},${category.id})`
            );
        });

        const deleteIdol = await db.query(
            `DELETE FROM JavIdol WHERE javId = ${id}`
        );

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO JavIdol (javId,idolId) VALUES (${id},${idol.id})`
            );
        });

        const deleteScene = await db.query(
            `DELETE FROM JavScene WHERE javId = ${id}`
        );

        scenes.forEach(async scene => {
            const resultScene = await db.query(
                `INSERT INTO JavScene (javId,sceneId) VALUES (${id},${scene.id})`
            );
        });

        return {
            data: newData, meta: result
        }
    } else {
        return {
            error: 'Duplicated Jav code!'
        }
    }
}


async function updateJavV2(id = 0, title = 'error', code = 'error', image = 'error', hide = 1, categories = [], idols = [], scenes = []) {
    const rows = await db.query(
        `SELECT * FROM Jav where id = ${id}`
    );
    const data = { Javs: helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM Jav where code = '${code}'`
    );
    const data2 = { Javs: helper.emptyOrRows(rows2) };

    if (data.Javs.length > 0 && (data2.Javs.length == 0 || data.Javs[0].id == data2.Javs[0].id)) {
        const result = await db.query(
            `UPDATE Jav set title = '${title}', code = '${code}', image = '${image}', hide = ${hide} WHERE id = ${id}`
        );
        const newRows = await db.query(
            `SELECT * FROM Jav where id = ${id}`
        );

        const deleteCategories = await db.query(
            `DELETE FROM JavCategory WHERE javId = ${id}`
        );

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO JavCategory (javId,categoryId) VALUES (${id},${category.id})`
            );
        });

        const deleteIdol = await db.query(
            `DELETE FROM JavIdol WHERE javId = ${id}`
        );

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO JavIdol (javId,idolId) VALUES (${id},${idol.id})`
            );
        });

        const deleteScene = await db.query(
            `DELETE FROM JavScene WHERE javId = ${id}`
        );

        scenes.forEach(async scene => {
            const resultScene = await db.query(
                `INSERT INTO JavScene (javId,sceneId) VALUES (${id},${scene.id})`
            );
        });

        return {
            Jav: helper.emptyOrRows(newRows), meta: result
        }
    } else {
        return {
            error: 'Duplicated Jav code!'
        }
    }
}

async function getRelatedJavsV2(id = 211, limit = 1) {
    const rows = await db.query(
        `SELECT j.*, (
	        SELECT count(c1.id) FROM Category c1 JOIN JavCategory jc ON c1.id = jc.categoryId WHERE jc.javId = j.id and c1.id IN (
		        SELECT c2.id FROM Category c2 JOIN JavCategory jc2 ON c2.id = jc2.categoryId WHERE jc2.javId = ${id})) as matchCount from Jav j where id <> ${id}
        order by matchCount desc, j.creation desc limit ${limit}`
    );
    return {
        Javs : helper.emptyOrRows(rows)
    }
}

module.exports = {
    getMultiple,
    getNewest,
    getJav,
    getAll,
    newJav,
    getJavId,
    updateJav,
    getMultipleV2,
    getNewestV2,
    getJavV2,
    getAllV2,
    newJavV2,
    getJavIdV2,
    updateJavV2,
    getRelatedJavsV2
}