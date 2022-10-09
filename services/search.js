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

    /* Categories search */
    var stringCategories;
    var idCategories = '12';
    var tempQueryCategories = `select * from Category`;
    const tempRowsCategories = await db.query(tempQueryCategories);
    words.forEach(word => {
        tempRowsCategories.forEach(tempCategory => {
            if (tempCategory.name == word) {
                idCategories = idCategories.concat(',',tempCategory.id);
            }
        });        
    });
    stringCategories= `SELECT * from Scene s join SceneCategory sc on s.id = sc.sceneId where sc.categoryId in (${tempRowsCategories[0].name})`;

    return{
        searching,
        dataIdols,
        words,
        stringCategories,
        idCategories
    }
}

module.exports = {
    getSearch
}