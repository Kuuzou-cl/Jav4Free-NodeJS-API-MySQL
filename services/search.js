const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getSearchV2(title, page = 1) {
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
    getSearchV2
}