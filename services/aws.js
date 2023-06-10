const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

const spacesEndpoint = new aws.Endpoint('s3.amazonaws.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'AKIATFEAPAONSNFVTAEW',
    secretAccessKey: '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',
});


async function getAll() {
    try {
        let objectsS3 = [];
        let continuationToken;
        let continueWhile = true;

        while (continueWhile) {
            let filesS3 = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', ContinuationToken: continuationToken }).promise();
            objectsS3.push(...filesS3.Contents.map(file => file.Key));
            continuationToken = filesS3.NextContinuationToken;
            continueWhile = filesS3.IsTruncated;
        }

        let sceneObjects = [];
        let previewObjects = [];
        let staticObjects = [];
        let scene480Objects = [];
        let spriteObjects = [];
        let vttObjects = [];

        for (let index = 0; index < objectsS3.length; index++) {
            if (objectsS3[index].includes('scenes/')) {
                sceneObjects.push(objectsS3[index]);
            } else {
                if (objectsS3[index].includes('scenes-preview/')) {
                    previewObjects.push(objectsS3[index]);
                } else {
                    if (objectsS3[index].includes('scenes-static/')) {
                        staticObjects.push(objectsS3[index]);
                    } else {
                        if (objectsS3[index].includes('scenes_480/')) {
                            scene480Objects.push(objectsS3[index]);
                        } else {
                            if (objectsS3[index].includes('sprites/')) {
                                spriteObjects.push(objectsS3[index]);
                            } else {
                                if (objectsS3[index].includes('vtts/')) {
                                    vttObjects.push(objectsS3[index]);
                                }
                            }
                        }
                    }
                }
            }
        }

        const rows = await db.query(
            `select * from Scene s`
        );
        const data = helper.emptyOrRows(rows);

        data.forEach(row => {
            row.video720p = false;
            row.video480p = false;
            row.videoStatic = false;
            row.videoPreview = false;
            row.videoSprite = false;
            row.videoVtt = false;
        });

        data.forEach(row => {
            for (let index = 0; index < sceneObjects.length; index++) {
                if ("scenes/" + row.code + ".mp4" == sceneObjects[index]) {
                    row.video720p = true;
                    break;
                }
            }
            for (let index = 0; index < scene480Objects.length; index++) {
                if ("scenes_480/" + row.code + "_1.mp4" == scene480Objects[index]) {
                    row.video480p = true;
                    break;
                }
            }
            for (let index = 0; index < staticObjects.length; index++) {
                if ("scenes-static/" + row.code + "-static.jpg" == staticObjects[index]) {
                    row.videoStatic = true;
                    break;
                }
            }
            for (let index = 0; index < previewObjects.length; index++) {
                if ("scenes-preview/" + row.code + ".mp4" == previewObjects[index]) {
                    row.videoPreview = true;
                    break;
                }
            }
            for (let index = 0; index < spriteObjects.length; index++) {
                if ("sprites/" + row.code + "_sprite.jpg" == spriteObjects[index]) {
                    row.videoSprite = true;
                    break;
                }
            }
            for (let index = 0; index < vttObjects.length; index++) {
                if ("vtts/" + row.code + "_thumbs.vtt" == vttObjects[index]) {
                    row.videoVtt = true;
                    break;
                }
            }
        });

        return { success: true, data: data }
    } catch (error) {
        return { success: false, data: null, error: error }
    }
}

async function getAllNotDB() {
    try {
        let objectsS3 = [];
        let continuationToken;
        let continueWhile = true;

        while (continueWhile) {
            let filesS3 = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', ContinuationToken: continuationToken }).promise();
            objectsS3.push(...filesS3.Contents.map(file => file.Key));
            continuationToken = filesS3.NextContinuationToken;
            continueWhile = filesS3.IsTruncated;
        }

        let javObjects = [];
        let sceneObjects = [];
        let idolObjects = [];

        for (let index = 0; index < objectsS3.length; index++) {
            if (objectsS3[index].includes('javs/')) {
                javObjects.push(objectsS3[index]);
            } else {
                if (objectsS3[index].includes('scenes/')) {
                    sceneObjects.push(objectsS3[index]);
                } else {
                    if (objectsS3[index].includes('idols/')) {
                        idolObjects.push(objectsS3[index]);
                    }
                }
            }
        }

        sceneObjects.shift();
        idolObjects.shift();

        const dataJ = [];
        const rowsJavs = await db.query(
            `select code from Jav j`
        );
        const dataJavs = helper.emptyOrRows(rowsJavs);
        for (let index = 0; index < javObjects.length; index++) {
            if (dataJavs.some(item => ("javs/" + item.code + ".jpg") === javObjects[index])) {
                dataJ.push({ file: javObjects[index], state: true });
            } else {
                dataJ.push({ file: javObjects[index], state: false });
            }
        }

        const dataS = [];
        const rowsScenes = await db.query(
            `select code from Scene s`
        );
        const dataScenes = helper.emptyOrRows(rowsScenes);
        for (let index = 0; index < sceneObjects.length; index++) {
            if (dataScenes.some(item => ("scenes/" + item.code + ".mp4") === sceneObjects[index])) {
                dataS.push({ file: sceneObjects[index], state: true });
            } else {
                dataS.push({ file: sceneObjects[index], state: false });
            }
        }

        const dataI = [];
        const rowsIdols = await db.query(
            `select name from Idol i`
        );
        const dataIdols = helper.emptyOrRows(rowsIdols);
        for (let index = 0; index < idolObjects.length; index++) {
            if (dataIdols.some(item => ("idols/" + item.name.replace(' ', '-').toLowerCase() + ".jpg") === idolObjects[index])) {
                dataI.push({ file: idolObjects[index], state: true });
            } else {
                dataI.push({ file: idolObjects[index], state: false });
            }
        }

        return { success: true, dataJavs: dataJ, dataScenes: dataS, dataIdols: dataI }
    } catch (error) {
        return { success: false, data: null, error: error }
    }
}

async function getStateFilesScenes(page = 1) {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    const perPage = config.listPerPageScenes;
    const query = "SELECT s.id, s.code, s.hide, IFNULL((SELECT ss.description FROM S3_Scenes ss WHERE ss.description = s.code), 'false') as video720, IFNULL((SELECT ss.description FROM S3_Scenes480 ss WHERE ss.description = s.code), 'false') as video480, IFNULL((SELECT ss.description FROM S3_ScenesPreview ss WHERE ss.description = s.code), 'false') as videoPreview, IFNULL((SELECT ss.description FROM S3_ScenesSprite ss WHERE ss.description = s.code), 'false') as videoSprite, IFNULL((SELECT ss.description FROM S3_ScenesStatic ss WHERE ss.description = s.code), 'false') as videoStatic, IFNULL((SELECT ss.description FROM S3_ScenesVTT ss WHERE ss.description = s.code), 'false') as videoVTT FROM Scene s order by s.id desc LIMIT ?,?"
    const rows = await db.query(query,[offset + "", perPage + ""]);

    const maxRows = await db.query(
        `SELECT * FROM Scene`
    );

    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };
    return {
        Scenes : helper.emptyOrRows(rows),
        meta
    }
}

async function getStateFilesJavs(page = 1) {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    const perPage = config.listPerPageScenes;
    const query = "SELECT j.id, j.code, j.hide, IFNULL( (SELECT sj.description FROM S3_Javs sj WHERE sj.description = j.code), 'false') as imageCover from Jav j order by j.id desc LIMIT ?,?"
    const rows = await db.query(query,[offset + "", perPage + ""]);

    const maxRows = await db.query(
        `SELECT * FROM Jav`
    );

    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };
    return {
        Javs : helper.emptyOrRows(rows),
        meta
    }
}

module.exports = {
    getStateFilesScenes,
    getStateFilesJavs
}