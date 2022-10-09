const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getSearch(title) {
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
    const rowsScenes = await db.query(stringScenes);
    const dataScenes = helper.emptyOrRows(rowsScenes);

    /* Search per word */
    var stringIdCategories = '';
    const tempAllRowsCategories = await db.query(`select * from Category`);
    words.forEach(word => {
        tempAllRowsCategories.forEach(tempCategory => {
            if (tempCategory.name.toUpperCase() == word.toUpperCase()) {
                stringIdCategories = stringIdCategories.concat(',', tempCategory.id);
            }
        });
    });

    var stringIdIdols = '';
    const tempAllRowsIdols = await db.query(`select * from Idol`);
    words.forEach(word => {
        tempAllRowsIdols.forEach(tempIdol => {
            if (tempIdol.name.toUpperCase() == word.toUpperCase()) {
                stringIdIdols = stringIdIdols.concat(',', tempIdol.id);
            }
        });
    });

    return {
        searching,
        words,
        dataIdols,
        dataScenes,
        stringIdCategories,
        stringIdIdols
    }
}

module.exports = {
    getSearch
}