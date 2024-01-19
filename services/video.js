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

module.exports = {
    getVideoByLatest

}