const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getSearch(keyword = "" , page = 1) {
    const splitted = keyword.split(' ');
    let rows = [];

    //Search if word is in code
    const queryByCode = 'SELECT * FROM jav.jav j WHERE j.code LIKE ?';
    for (let index = 0; index < splitted.length; index++) {
        let tempString = '%' + splitted[index] + '%';
        let rowsByTitle = await db.query(queryByCode, [tempString]);
        for (let indexb = 0; indexb < helper.emptyOrRows(rowsByTitle).length; indexb++) {
            if (!rows.some(item => item.id === rowsByTitle[indexb].id)) {
                rows.push(rowsByTitle[indexb]);
            }
        }
    }

    //Search if word is in title
    const queryByTitle = 'SELECT * FROM jav.jav j WHERE j.title LIKE ?';
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
    const queryByCategory = 'SELECT * FROM jav.jav j JOIN jav_category jc on j.id = jc.jav_id JOIN jav.cateogry c on c.id = jc.category_id WHERE c.name LIKE ?';
    for (let index = 0; index < splitted.length; index++) {
        let rowsByCategories = await db.query(queryByCategory, [splitted[index]]);
        for (let indexb = 0; indexb < helper.emptyOrRows(rowsByCategories).length; indexb++) {
            if (!rows.some(item => item.id === rowsByCategories[indexb].id)) {
                rows.push(rowsByCategories[indexb]);
            }
        }
    }

    //Search if word is an idol
    const queryByIdol = 'SELECT * from jav.jav j JOIN jav_idol ji on j.id = ji.jav_id JOIN jav.idol i on i.id = ji.idol_id where i.name LIKE ?';
    for (let index = 0; index < splitted.length; index++) {
        let rowsByIdols = await db.query(queryByIdol, [splitted[index]]);
        for (let indexb = 0; indexb < helper.emptyOrRows(rowsByIdols).length; indexb++) {
            if (!rows.some(item => item.id === rowsByIdols[indexb].id)) {
                rows.push(rowsByIdols[indexb]);
            }
        }
    }

    const pagesData = helper.getCountPages(page,config.listPerPageScenes,rows.length);

    if (rows.length > 0) {
        rows = rows.slice((page - 1) * config.listPerPageScenes,(config.listPerPageScenes * page))
    }

    return {
        Response:{
            Javs: helper.emptyOrRows(rows),
            page: page,
            nextPage: pagesData.nextPage, 
            lastPage: pagesData.lastPage
        }
    }
}

module.exports = {
    getSearch
}