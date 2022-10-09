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
    stringIdCategories = stringIdCategories.concat('',')');

    var stringIdIdols = 'SELECT s.id, s.title, s.code, s.video, s.duration, s.hide, s.previewImage, s.staticImage, s.creation, s.vtt, s.video480p FROM Scene s join SceneIdol si on s.id = si.sceneId WHERE si.idolId in (0';
    const tempAllRowsIdols = await db.query(`select * from Idol`);
    words.forEach(word => {
        tempAllRowsIdols.forEach(tempIdol => {
            if (tempIdol.name.toUpperCase().includes(word.toUpperCase())) {
                stringIdIdols = stringIdIdols.concat(',', tempIdol.id);
            }
        });
    });
    stringIdIdols = stringIdIdols.concat('',')');

    var stringCode = `SELECT * from Scene s WHERE s.code like '%XXX%'`;
    words.forEach(word => {
        var tempWord = `or s.code like '%${word}%'`;
        stringCode = stringCode.concat(' ', tempWord);
    });

    stringScenes = stringScenes.concat(' union ',stringIdCategories);
    stringScenes = stringScenes.concat(' union ',stringIdIdols);
    stringScenes = stringScenes.concat(' union ',stringCode);
    stringScenes = stringScenes.concat(' order by id ', `LIMIT ${offset},${config.listPerPageScenes}`)

    const rowsScenes = await db.query(stringScenes);
    const dataScenes = helper.emptyOrRows(rowsScenes);

    const pagesData = helper.getCountPages(page,config.listPerPageScenes,dataScenes.length);

    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        dataIdols,
        dataScenes,
        meta
    }
}

module.exports = {
    getSearch
}