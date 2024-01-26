const db = require('./db');
const helper = require('../helper');
const config = require('../config');

//v3
async function getVideoByLatest(limit = 16) {
    let rows = await db.query(
        `select * from jav.video v where v.hide = 0 and poster is not null and title is not null and video is not null and video_preview is not null order by release_date desc limit 0,${limit}`
    );

    rows = helper.emptyOrRows(rows);

    return {
        Response: helper.emptyOrRows(rows)
    }
}

async function getVideoByCode(code = 1) {

    const rowsVideo = await db.query(
        `SELECT id, code, title, length, poster, video, video_preview, vtt FROM video v where v.code = '${code}'`
    );
    const rowsCategories = await db.query(
        `SELECT c.id, c.name from category c join video_category vc on c.id = vc.category_id join video v on vc.video_id = v.id where v.code = '${code}'`
    );
    const rowsIdols = await db.query(
        `SELECT i.id, i.name, i.poster from idol i join video_idol vi on vi.idol_id = i.id join video v on vi.video_id = v.id where v.code = '${code}'`
    );

    return {
        Response: {
            Video: helper.emptyOrRows(rowsVideo[0]),
            Categories: helper.emptyOrRows(rowsCategories),
            Idols: helper.emptyOrRows(rowsIdols)
        }
    }
}

module.exports = {
    getVideoByLatest,
    getVideoByCode
}