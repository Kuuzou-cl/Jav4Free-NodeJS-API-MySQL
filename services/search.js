const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getSearch(title, page = 1) {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    const searching = title;
    const words = title.split(' ');

    /* Idols search */
    var stringIdols = `select * from Idol i WHERE name like '%${searching}%' `;
    words.forEach(word => {
        stringIdols = stringIdols.concat(' ', `union select * from Idol i WHERE name like '%${word}%'`);
    });
    const rowsIdols = await db.query(stringIdols);
    const dataIdols = helper.emptyOrRows(rowsIdols);

    /* Scenes title or code search */
    var stringScenes = `SELECT * FROM Scene s where s.title like '%${searching}%' union SELECT * FROM Scene s WHERE s.code like '%${searching}%'`


    /* Search per word */
    var stringIdCategories = 'SELECT s.id, s.title, s.code, s.video, s.duration, s.hide, s.previewImage, s.staticImage, s.creation, s.vtt, s.video480p from Scene s join SceneCategory sc on s.id = sc.sceneId where sc.categoryId in (0';
    const tempAllRowsCategories = await db.query(`select * from Category`);
    words.forEach(word => {
        tempAllRowsCategories.forEach(tempCategory => {
            if (tempCategory.name.toUpperCase() == word.toUpperCase()) {
                stringIdCategories = stringIdCategories.concat(',', tempCategory.id);
            }
        });
    });
    stringIdCategories = stringIdCategories.concat('', ')');

    var stringIdIdols = 'SELECT s.id, s.title, s.code, s.video, s.duration, s.hide, s.previewImage, s.staticImage, s.creation, s.vtt, s.video480p FROM Scene s join SceneIdol si on s.id = si.sceneId WHERE si.idolId in (0';
    const tempAllRowsIdols = await db.query(`select * from Idol`);
    words.forEach(word => {
        tempAllRowsIdols.forEach(tempIdol => {
            if (tempIdol.name.toUpperCase().includes(word.toUpperCase())) {
                stringIdIdols = stringIdIdols.concat(',', tempIdol.id);
            }
        });
    });
    stringIdIdols = stringIdIdols.concat('', ')');

    var stringCode = `SELECT * from Scene s WHERE s.code like '%XXX%'`;
    words.forEach(word => {
        var tempWord = `or s.code like '%${word}%'`;
        stringCode = stringCode.concat(' ', tempWord);
    });

    stringScenes = stringScenes.concat(' union ', stringIdCategories);
    stringScenes = stringScenes.concat(' union ', stringIdIdols);
    stringScenes = stringScenes.concat(' union ', stringCode);


    const rowsScenes = await db.query(stringScenes);
    stringScenes = stringScenes.concat(' order by id ', `LIMIT ${offset},${config.listPerPageScenes}`)
    const rowsScenesLimit = await db.query(stringScenes);
    const dataScenesNoLimit = helper.emptyOrRows(rowsScenes);
    const dataScenes = helper.emptyOrRows(rowsScenesLimit);

    const pagesData = helper.getCountPages(page, config.listPerPageScenes, dataScenesNoLimit.length);

    const meta = { page: page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        dataIdols,
        dataScenes,
        meta
    }
}

async function getSearchV2(title, page = 1) {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    const splitted = title.split(' ');
    let rows = [];

    //Search if word is in title
    const queryByTitle = 'SELECT s.* FROM Scene s WHERE s.title LIKE ?';
    for (let index = 0; index < splitted.length; index++) {
        let tempString = '%' + splitted[index] + '%';
        let rowsByTitle = await db.query(queryByTitle, [tempString]);
        for (let indexb = 0; indexb < helper.emptyOrRows(rowsByTitle).length; indexb++) {
            if (!rows.some(item => item.id === rowsByTitle[indexb].id)) {
                rows.push(rowsByTitle[indexb]);
            }
        }
    }

    //Search if word is a category
    const queryByCategory = 'SELECT s.* FROM Scene s JOIN SceneCategory sc on s.id = sc.sceneId JOIN Category c on c.id = sc.categoryId WHERE c.name LIKE ?';
    for (let index = 0; index < splitted.length; index++) {
        let rowsByCategories = await db.query(queryByCategory, [splitted[index]]);
        for (let indexb = 0; indexb < helper.emptyOrRows(rowsByCategories).length; indexb++) {
            if (!rows.some(item => item.id === rowsByCategories[indexb].id)) {
                rows.push(rowsByCategories[indexb]);
            }
        }
    }

    //Search if word is an idol
    const queryByIdol = 'SELECT s.* from Scene s JOIN SceneIdol si on s.id = si.sceneId JOIN Idol i on i.id = si.idolId where i.name LIKE ?';
    for (let index = 0; index < splitted.length; index++) {
        let rowsByIdols = await db.query(queryByIdol, [splitted[index]]);
        for (let indexb = 0; indexb < helper.emptyOrRows(rowsByIdols).length; indexb++) {
            if (!rows.some(item => item.id === rowsByIdols[indexb].id)) {
                rows.push(rowsByIdols[indexb]);
            }
        }
    }

    const pagesData = helper.getCountPages(page,config.listPerPageScenes,rows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    if (rows.length > 0) {
        rows = rows.slice((page - 1) * config.listPerPageScenes,(config.listPerPageScenes * page))
    }

    return {
        Scenes : helper.emptyOrRows(rows),
        meta
    }
}

module.exports = {
    getSearch,
    getSearchV2
}