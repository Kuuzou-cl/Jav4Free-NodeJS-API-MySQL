const db = require('./db');
const helper = require('../helper');
const config = require('../config');

//v3 
async function getJavByLatest(limit = 2) {
    let rows = await db.query(
        `select * from jav.jav j where j.hide = 0 and poster is not null and title is not null order by release_date desc limit 0,${limit}`
    );

    rows = helper.emptyOrRows(rows);

    for (let index = 0; index < rows.length; index++) {
        let rows_categories = await db.query(
            `select id, name from jav.category c join jav.jav_category jc on c.id = jc.category_id where jc.jav_id = ${rows[index].id} ORDER BY RAND() limit 0,2`
        );
        rows[index].categories = helper.emptyOrRows(rows_categories);
        let rows_idols = await db.query(
            `select id, name from jav.idol i join jav.jav_idol ji on i.id = ji.idol_id where ji.jav_id = ${rows[index].id} ORDER BY RAND() limit 1`
        );
        rows[index].idols = helper.emptyOrRows(rows_idols);
    }

    return {
        Response: helper.emptyOrRows(rows)
    }
}

async function getJavByCode(code = 0) {

    const rowsJav = await db.query(
        `SELECT * FROM jav j where j.code = '${code}'`
    );

    if (rowsJav[0]) {
        const rowsCategories = await db.query(
            `SELECT * from category c join jav_category jc on c.id = jc.category_id where jc.jav_id = (SELECT id FROM jav j where j.code = '${code}')`
        );
        rowsJav[0].categories = helper.emptyOrRows(rowsCategories);
        const rowsIdols = await db.query(
            `SELECT * from idol i join jav_idol ji on ji.idol_id = i.id WHERE ji.jav_id = (SELECT id FROM jav j where j.code = '${code}')`
        );
        rowsJav[0].idols = helper.emptyOrRows(rowsIdols);
    }

    return {
        Response: helper.emptyOrRows(rowsJav[0])
    }
}

async function getJavByRand(limit = 2) {
    let rows = await db.query(
        `select * from jav.jav j where j.hide = 0 and poster is not null and title is not null order BY RAND() limit 0,${limit}`
    );

    rows = helper.emptyOrRows(rows);

    for (let index = 0; index < rows.length; index++) {
        let rows_categories = await db.query(
            `select id, name from jav.category c join jav.jav_category jc on c.id = jc.category_id where jc.jav_id = ${rows[index].id} ORDER BY RAND() limit 0,2`
        );
        rows[index].categories = helper.emptyOrRows(rows_categories);
        let rows_idols = await db.query(
            `select id, name from jav.idol i join jav.jav_idol ji on i.id = ji.idol_id where ji.jav_id = ${rows[index].id} ORDER BY RAND() limit 1`
        );
        rows[index].idols = helper.emptyOrRows(rows_idols);
    }

    return {
        Response: helper.emptyOrRows(rows)
    }
}

async function getJavByPage(page = 1) {
    const offset = helper.getOffset(page, config.listPerPageJavs);

    const rows = await db.query(
        `SELECT * FROM jav.jav j WHERE j.hide = 0 order by release_date desc LIMIT ${offset},${config.listPerPageJavs}`
    );

    const maxRows = await db.query(
        `SELECT * FROM jav.jav j WHERE j.hide = 0`
    );

    const pagesData = helper.getCountPages(page, config.listPerPageJavs, maxRows.length);

    return {
        Response: {
            Javs: helper.emptyOrRows(rows),
            page: page,
            nextPage: pagesData.nextPage,
            lastPage: pagesData.lastPage
        }
    }
}

async function getAllJavByPage(page = 1) {
    const offset = helper.getOffset(page, config.listPerPageJavs);

    const rows = await db.query(
        `SELECT * FROM jav.jav j order by release_date desc LIMIT ${offset},${config.listPerPageJavs}`
    );

    const maxRows = await db.query(
        `SELECT * FROM jav.jav j`
    );

    const pagesData = helper.getCountPages(page, config.listPerPageJavs, maxRows.length);

    return {
        Response: {
            Javs: helper.emptyOrRows(rows),
            page: page,
            nextPage: pagesData.nextPage,
            lastPage: pagesData.lastPage
        }
    }
}

async function getJavById(id = 0) {

    const rowsJav = await db.query(
        `SELECT id, code, title, DATE_FORMAT(release_date,'%Y-%m-%d') as release_date, video,static, preview, poster,vtt,hide FROM jav.jav j where j.id = '${id}'`
    );

    if (rowsJav[0]) {
        const rowsCategories = await db.query(
            `SELECT * from category c join jav_category jc on c.id = jc.category_id where jc.jav_id = (SELECT id FROM jav j where j.id = '${id}')`
        );
        rowsJav[0].categories = helper.emptyOrRows(rowsCategories);
        const rowsIdols = await db.query(
            `SELECT * from idol i join jav_idol ji on ji.idol_id = i.id WHERE ji.jav_id = (SELECT id FROM jav j where j.id = '${id}')`
        );
        rowsJav[0].idols = helper.emptyOrRows(rowsIdols);
    }

    return {
        Response: helper.emptyOrRows(rowsJav[0])
    }
}

async function updateJav(id = 0, title = 'error', code = 'error', release_date = 'error', video = '', static = '', preview = '', poster = '', vtt = '', hide = 1, categories = [], idols = []) {

    const rows = await db.query(
        `SELECT * FROM jav.jav where id = ${id}`
    );
    const data = { Javs: helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM jav.jav where code = '${code}'`
    );
    const data2 = { Javs: helper.emptyOrRows(rows2) };

    if (data.Javs.length > 0 && (data2.Javs.length == 0 || data.Javs[0].id == data2.Javs[0].id)) {
        const result = await db.query(
            `UPDATE jav.jav set code = '${code}', title = '${title}', release_date = '${release_date}', video = '${video}', static = '${static}', preview = '${preview}', poster = '${poster}', vtt = '${vtt}', hide = ${hide} WHERE id = ${id}`
        );
        const newRows = await db.query(
            `SELECT * FROM jav.jav where id = ${id}`
        );

        const deleteCategories = await db.query(
            `DELETE FROM jav_category WHERE jav_id = ${id}`
        );

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO jav_category (jav_id,category_id) VALUES (${id},${category.id})`
            );
        });

        const deleteIdol = await db.query(
            `DELETE FROM jav_idol WHERE jav_id = ${id}`
        );

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO jav_idol (jav_id,idol_id) VALUES (${id},${idol.id})`
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

async function newJav(title = 'error', code = 'error', release_date = 'error', video = '', static = '', preview = '', poster = '', vtt = '', hide = 1, categories = [], idols = []) {
    const rows = await db.query(
        `SELECT * FROM jav.jav where code = '${code}'`
    );
    const data = { Javs: helper.emptyOrRows(rows) };

    if (data.Javs.length == 0) {
        const result = await db.query(
            `INSERT INTO jav.jav (title,code,release_date,video,static,preview,poster,vtt,hide) VALUES ('${title}','${code}','${release_date}','${video}','${static}','${preview}','${poster}','${vtt}',${hide})`
        );
        const newRows = await db.query(
            `SELECT * FROM jav.jav where id = '${result.insertId}'`
        );

        categories.forEach(async category => {
            const resultCategory = await db.query(
                `INSERT INTO jav_category (jav_id,category_id) VALUES (${result.insertId},${category.id})`
            );
        });

        idols.forEach(async idol => {
            const resultIdol = await db.query(
                `INSERT INTO jav_idol (jav_id,idol_id) VALUES (${result.insertId},${idol.id})`
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

async function generateUploadUrl() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer SxkdTrqEFxljuD2kaRgQbEG2G78oXMwNqHxStiSp");
    myHeaders.append("Cookie", "__cflb=0H28vgHxwvgAQtjUGUFqYFDiSDreGJnV2DqXwDAyEKF");

    const formdata = new FormData();
    formdata.append("requireSignedURLs", "True");
    formdata.append("metadata", "{\"key\":\"value\"}");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
    };

    const urlResponse = "";
    const urlResult = "";
    const urlError = "";

    await fetch("https://api.cloudflare.com/client/v4/accounts/70e8c8aff115acf6bcc8cd9998cdda6e/images/v2/direct_upload", requestOptions)
        .then((response) => urlResponse = response.text())
        .then((result) => urlResult = result)
        .catch((error) => urlError = error);

    return {
        Response: {
            urlResponse: urlResponse, urlResult: urlResult, urlError: urlError
        }
    }
}


module.exports = {
    getJavByLatest,
    getJavByCode,
    getJavByRand,
    getJavByPage,
    getAllJavByPage,
    getJavById,
    updateJav,
    newJav,
    generateUploadUrl
}