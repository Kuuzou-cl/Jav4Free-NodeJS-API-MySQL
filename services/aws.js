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

async function getStateFilesIdols(page = 1) {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    const perPage = config.listPerPageScenes;
    const query = "SELECT i.id, i.name, IFNULL( (SELECT si.description FROM S3_Idols si WHERE si.description = LOWER(i.name)), 'false' ) as image from Idol i order by i.id desc LIMIT ?,?"
    const rows = await db.query(query,[offset + "", perPage + ""]);

    const maxRows = await db.query(
        `SELECT * FROM Idol`
    );

    const pagesData = helper.getCountPages(page,config.listPerPageScenes,maxRows.length);
    const meta = { page : page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };
    return {
        Idols : helper.emptyOrRows(rows),
        meta
    }
}

async function getPendingFiles() {
    const queryJ = "SELECT * from (SELECT sj.id, sj.description, IFNULL((SELECT j.code from Jav j WHERE j.code = sj.description), 'false') as state  FROM S3_Javs sj) temp where state = 'false'"
    const rowsJ = await db.query(queryJ);

    const queryS = "SELECT * from (SELECT ss.id, ss.description, IFNULL((SELECT s.code from Scene s where s.code = ss.description limit 1), 'false') as state from S3_Scenes ss) temp WHERE state = 'false'"
    const rowsS = await db.query(queryS);

    const queryI = "SELECT * from (SELECT si.id, si.description, IFNULL((SELECT i.name FROM Idol i where LOWER(i.name) = si.description),'false') as state  FROM S3_Idols si) temp WHERE state = 'false'"
    const rowsI = await db.query(queryI);

    return {
        Javs: helper.emptyOrRows(rowsJ),
        Scenes: helper.emptyOrRows(rowsS),
        Idols : helper.emptyOrRows(rowsI)
    }
}

module.exports = {
    getStateFilesScenes,
    getStateFilesJavs,
    getStateFilesIdols,
    getPendingFiles
}