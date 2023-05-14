const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getS3FilesMatch() {
    const scenesRows = await db.query(
        `SELECT * FROM S3_Scenes`
    );
    const scenesRows480 = await db.query(
        `SELECT * FROM S3_Scenes480`
    );
    const scenesRowsPreview = await db.query(
        `SELECT * FROM S3_ScenesPreview`
    );
    const scenesRowsStatic = await db.query(
        `SELECT * FROM S3_ScenesStatic`
    );
    const scenesRowsSprite = await db.query(
        `SELECT * FROM S3_ScenesSprite`
    );
    const scenesRowsVtt = await db.query(
        `SELECT * FROM S3_ScenesVTT`
    );

    const scenes = helper.emptyOrRows(scenesRows);
    const scenes480 = helper.emptyOrRows(scenesRows480);
    const scenesPreview = helper.emptyOrRows(scenesRowsPreview);
    const scenesStatic = helper.emptyOrRows(scenesRowsStatic);

    const scenesSprite = helper.emptyOrRows(scenesRowsSprite);

    const scenesVtt = helper.emptyOrRows(scenesRowsVtt);

    let allArray = [];

    scenes.forEach(element => {
        allArray.push({ scene: element.description });
    });

    scenes480.forEach(elementA => {
        let exist = false;
        for (let index = 0; index < allArray.length; index++) {
            if (elementA.description == allArray[index].scene) {
                allArray[index].scenes480 = elementA.description;
                exist = true;
                break;
            }
        }
        if (!exist) {
            allArray.push({ scene: '', scenes480: elementA.description })
        }
    });

    scenesPreview.forEach(elementA => {
        let exist = false;
        for (let index = 0; index < allArray.length; index++) {
            if (elementA.description == allArray[index].scene || elementA.description == allArray[index].scenes480) {
                allArray[index].scenesPreview = elementA.description;
                exist = true;
                break;
            }
        }
        if (!exist) {
            allArray.push({ scene: '', scenes480: '', scenesPreview: elementA.description })
        }
    });

    scenesStatic.forEach(elementA => {
        let exist = false;
        for (let index = 0; index < allArray.length; index++) {
            if (elementA.description == allArray[index].scene || elementA.description == allArray[index].scenes480 || elementA.description == allArray[index].scenesPreview) {
                allArray[index].scenesStatic = elementA.description;
                exist = true;
                break;
            }
        }
        if (!exist) {
            allArray.push({ scene: '', scenes480: '', scenesPreview: '', scenesStatic: elementA.description })
        }
    });

    scenesSprite.forEach(elementA => {
        let exist = false;
        for (let index = 0; index < allArray.length; index++) {
            if (elementA.description == allArray[index].scene || elementA.description == allArray[index].scenes480 || elementA.description == allArray[index].scenesPreview
                || elementA.description == allArray[index].scenesStatic) {
                allArray[index].scenesSprite = elementA.description;
                exist = true;
                break;
            }
        }
        if (!exist) {
            allArray.push({ scene: '', scenes480: '', scenesPreview: '', scenesStatic: '', scenesSprite: elementA.description })
        }
    });

    scenesVtt.forEach(elementA => {
        let exist = false;
        for (let index = 0; index < allArray.length; index++) {
            if (elementA.description == allArray[index].scene || elementA.description == allArray[index].scenes480 || elementA.description == allArray[index].scenesPreview
                || elementA.description == allArray[index].scenesStatic || elementA.description == allArray[index].scenesSprite) {
                allArray[index].scenesVtt = elementA.description;
                exist = true;
                break;
            }
        }
        if (!exist) {
            allArray.push({ scene: '', scenes480: '', scenesPreview: '', scenesStatic: '', scenesSprite: '', scenesVtt: elementA.description })
        }
    });

    allArray.forEach(element => {
        if (!element.hasOwnProperty('scene')) {
            element.scene = '';
        }
        if (!element.hasOwnProperty('scenes480')) {
            element.scenes480 = '';
        }
        if (!element.hasOwnProperty('scenesPreview')) {
            element.scenesPreview = '';
        }
        if (!element.hasOwnProperty('scenesStatic')) {
            element.scenesStatic = '';
        }
        if (!element.hasOwnProperty('scenesSprite')) {
            element.scenesSprite = '';
        }
        if (!element.hasOwnProperty('scenesVtt')) {
            element.scenesVtt = '';
        }
    });

    return {
        Files: allArray
    }
}

module.exports = {
    getS3FilesMatch
}