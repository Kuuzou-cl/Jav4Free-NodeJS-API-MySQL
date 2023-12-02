const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const dotenv = require('dotenv').config();
const cloudfrontSigner = require('@aws-sdk/cloudfront-signer');

async function getJavById(id = 1) {

    const rowsJav = await db.query(
        `SELECT id, code, title, length, DATE_FORMAT(release_date, "%M %d %Y"), poster, video FROM jav j where j.id = '${id}'`
    );
    const rowsCategories = await db.query(
        `SELECT c.id, c.name from category c join jav_category jc on c.id = jc.category_id where jc.jav_id = '${id}'`
    );
    const rowsIdols = await db.query(
        `SELECT i.id, i.name, i.poster from idol i join jav_idol ji on ji.idol_id = i.id WHERE ji.jav_id = '${id}'`
    );
    const rowsProducer = await db.query(
        `SELECT p.id, p.name from producer p join jav_producer pi on pi.producer_id = p.id WHERE pi.jav_id = '${id}'`
    );

    if (helper.emptyOrRows(rowsJav[0]).length > 0) {
        rowsJav[0].poster = cloudfrontSigner.getSignedUrl({
            url: rowsJav[0].poster,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
            privateKey: process.env.cloudfront_privateKey,
            keyPairId: process.env.cloudfront_keyPairId
        });

        rowsJav[0].video = cloudfrontSigner.getSignedUrl({
            url: rowsJav[0].video,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
            privateKey: process.env.cloudfront_privateKey,
            keyPairId: process.env.cloudfront_keyPairId
        });

        rowsJav[0].vtt = cloudfrontSigner.getSignedUrl({
            url: rowsJav[0].vtt,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
            privateKey: process.env.cloudfront_privateKey,
            keyPairId: process.env.cloudfront_keyPairId
        });
    }

    if (helper.emptyOrRows(rowsIdols).length > 0) {
        helper.emptyOrRows(rowsIdols).forEach(element => {
            element.poster = cloudfrontSigner.getSignedUrl({
                url: element.poster,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });
        });
    }

    return {
        Jav: helper.emptyOrRows(rowsJav[0]),
        Categories: helper.emptyOrRows(rowsCategories),
        Idols: helper.emptyOrRows(rowsIdols),
        Producer: helper.emptyOrRows(rowsProducer[0])
    }
}

async function getJavByCode(code = 0) {

    const rowsJav = await db.query(
        `SELECT * FROM jav j where j.code = '${code}'`
    );
    const rowsCategories = await db.query(
        `SELECT * from category c join jav_category jc on c.id = jc.category_id where jc.jav_id = (SELECT id FROM jav j where j.code = '${code}')`
    );
    const rowsIdols = await db.query(
        `SELECT * from idol i join jav_idol ji on ji.idol_id = i.id WHERE ji.jav_id = (SELECT id FROM jav j where j.code = '${code}')`
    );
    const rowsProducer = await db.query(
        `SELECT p.id, p.name from producer p join jav_producer pi on pi.producer_id = p.id WHERE pi.jav_id = (SELECT id FROM jav j where j.code = '${code}')`
    );

    if (helper.emptyOrRows(rowsJav[0]).length > 0) {
        rowsJav[0].poster = cloudfrontSigner.getSignedUrl({
            url: rowsJav[0].poster,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
            privateKey: process.env.cloudfront_privateKey,
            keyPairId: process.env.cloudfront_keyPairId
        });

        rowsJav[0].video = cloudfrontSigner.getSignedUrl({
            url: rowsJav[0].video,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
            privateKey: process.env.cloudfront_privateKey,
            keyPairId: process.env.cloudfront_keyPairId
        });

        rowsJav[0].vtt = cloudfrontSigner.getSignedUrl({
            url: rowsJav[0].vtt,
            dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
            privateKey: process.env.cloudfront_privateKey,
            keyPairId: process.env.cloudfront_keyPairId
        });
    }

    if (helper.emptyOrRows(rowsIdols).length > 0) {
        helper.emptyOrRows(rowsIdols).forEach(element => {
            element.poster = cloudfrontSigner.getSignedUrl({
                url: element.poster,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });
        });
    }

    return {
        Jav: helper.emptyOrRows(rowsJav[0]),
        Categories: helper.emptyOrRows(rowsCategories),
        Idols: helper.emptyOrRows(rowsIdols),
        Producer: helper.emptyOrRows(rowsProducer[0])
    }
}

async function getJavs(page = 1, hide = 0, variable = 'id', order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageJavs);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * FROM jav WHERE hide = ${hide} order by ${variable}  ${order} LIMIT ${offset},${config.listPerPageJavs}`
    );

    const tempId = []
    rows.forEach(element => {
        tempId.push(element.id);
    });

    let rowsCategories = [];

    for (let index = 0; index < tempId.length; index++) {
        rowsCategories.push(helper.emptyOrRows(await db.query(
            `SELECT c.id, c.name FROM category c join jav_category jc on c.id = jc.category_id and jc.jav_id = ${tempId[index]} ORDER BY RAND() LIMIT 0,3`
        )));
    }

    for (let index = 0; index < rows.length; index++) {
        rows[index].categories = rowsCategories[index];
    }

    const maxRows = await db.query(
        `SELECT * FROM jav WHERE hide = ${hide}`
    );

    if (helper.emptyOrRows(rows).length > 0) {

        helper.emptyOrRows(rows).forEach(element => {
            element.poster = cloudfrontSigner.getSignedUrl({
                url: element.poster,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });

            element.video = cloudfrontSigner.getSignedUrl({
                url: element.video,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });

            element.vtt = cloudfrontSigner.getSignedUrl({
                url: element.vtt,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });
        });

    }

    const pagesData = helper.getCountPages(page, config.listPerPageJavs, maxRows.length);
    const meta = { page: page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        Javs: helper.emptyOrRows(rows),
        meta
    }
}

async function getJavsByLatest(limit = 1) {
    const rows = await db.query(
        `SELECT * FROM jav WHERE hide = 0 order by id desc LIMIT 0,${limit}`
    );

    const tempId = []
    rows.forEach(element => {
        tempId.push(element.id);
    });

    let rowsCategories = [];

    for (let index = 0; index < tempId.length; index++) {
        rowsCategories.push(helper.emptyOrRows(await db.query(
            `SELECT c.id, c.name FROM category c join jav_category jc on c.id = jc.category_id and jc.jav_id = ${tempId[index]} ORDER BY RAND() LIMIT 0,3`
        )));
    }

    for (let index = 0; index < rows.length; index++) {
        rows[index].categories = rowsCategories[index];
    }

    if (helper.emptyOrRows(rows).length > 0) {

        helper.emptyOrRows(rows).forEach(element => {
            element.poster = cloudfrontSigner.getSignedUrl({
                url: element.poster,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });

            element.video = cloudfrontSigner.getSignedUrl({
                url: element.video,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });

            element.vtt = cloudfrontSigner.getSignedUrl({
                url: element.vtt,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                privateKey: process.env.cloudfront_privateKey,
                keyPairId: process.env.cloudfront_keyPairId
            });
        });

    }

    return {
        Javs: helper.emptyOrRows(rows)
    }
}

async function getJavViewById(id = 0) {
    const rows = await db.query(
        `INSERT INTO jav_view (jav_id) VALUES (${id})`
    );
    return {
        result: helper.emptyOrRows(rows)
    }
}

//------------------------------------------------------

async function getRelatedJavsV2(id = 211, limit = 1) {
    const rows = await db.query(
        `SELECT j.*, (
	        SELECT count(c1.id) FROM Category c1 JOIN JavCategory jc ON c1.id = jc.categoryId WHERE jc.javId = j.id and c1.id IN (
		        SELECT c2.id FROM Category c2 JOIN JavCategory jc2 ON c2.id = jc2.categoryId WHERE jc2.javId = ${id})) as matchCount from Jav j where id <> ${id}
        order by matchCount desc, j.creation desc limit ${limit}`
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

module.exports = {
    getJavById,
    getJavByCode,
    getJavs,
    getJavsByLatest,
    getJavViewById,
    //
    getRelatedJavsV2,
    newJavV2,
    updateJavV2,

}