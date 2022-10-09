const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getSearch(title) {
    const searching = title;
    const words = title.split(' ');

    /* Idols search */
    const stringIdols = `select * from Idol i WHERE name like '%${searching}%' `;
    for (let index = 0; index < words.length; index++) {
        const element = words[index];
        stringIdols.concat(' ', element);
    }
    stringIdols.concat(' ', 'test');
    const rowsIdols = await db.query(stringIdols);
    const dataIdols = helper.emptyOrRows(rowsIdols);

    return{
        searching,
        dataIdols,
        stringIdols,
        words
    }
}

module.exports = {
    getSearch
}