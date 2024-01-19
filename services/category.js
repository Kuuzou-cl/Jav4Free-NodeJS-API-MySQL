const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getHotCategories(limit = 6) {
    const rows = await db.query(
        `select c.id, c.name, count(jc.category_id) as countJav from jav.jav_category jc join jav.category c on jc.category_id = c.id 
        group by jc.category_id order by countJav desc limit 0,${limit}`
    );

    return {
        Response: helper.emptyOrRows(rows)
    }
}

async function getCategories() {
    const rows = await db.query(
        `SELECT * FROM category order by name`
    );

    return {
        Categories: helper.emptyOrRows(rows)
    }
}

async function getCategory(id = 0) {
    const rows = await db.query(
        `SELECT * FROM category WHERE id = '${id}'`
    );

    return {
        Category: helper.emptyOrRows(rows[0])
    }
}

async function getJavsByCategories(page = 1, name = '', order = 'desc') {
    const offset = helper.getOffset(page, config.listPerPageScenes);
    if (order != 'desc' && order != 'asc') {
        order = 'desc'
    }
    const rows = await db.query(
        `SELECT * from jav s join jav_category sc on s.id = sc.jav_id where sc.category_id = (SELECT c.id from category c WHERE c.name = '${name}') order by s.id ${order} LIMIT ${offset},${config.listPerPageScenes}`
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
        `SELECT * from jav s join jav_category sc on s.id = sc.jav_id where sc.category_id = (SELECT c.id from category c WHERE c.name = '${name}') order by s.id ${order}`
    );
    const pagesData = helper.getCountPages(page, config.listPerPageScenes, maxRows.length);
    const meta = { page: page, nextPage: pagesData.nextPage, lastPage: pagesData.lastPage };

    return {
        Javs: helper.emptyOrRows(rows),
        meta
    }
}

async function newCategory(name = '') {
    if (typeof name === "string" && name.length === 0) {
        return {
            error: 'Name can\'t by empty.'
        }
    } else if (name === null) {
        return {
            error: 'Name can\'t by empty.'
        }
    } else {
        const rows = await db.query(
            `SELECT * FROM category where name = '${name}'`
        );
        const data = { Categories: helper.emptyOrRows(rows) };

        if (data.Categories.length == 0) {
            const result = await db.query(
                `INSERT INTO category (name) VALUES ('${name}')`
            );
            return {
                msg: 'Category added.'
            }
        } else {
            return {
                error: 'Category already exist.'
            }
        }
    }
}

async function updateCategory(id = 0, name = '') {
    const rows = await db.query(
        `SELECT * FROM category where id = ${id}`
    );
    const data = { Categories: helper.emptyOrRows(rows) };

    const rows2 = await db.query(
        `SELECT * FROM category where name = '${name}'`
    );
    const data2 = { Categories: helper.emptyOrRows(rows2) };

    if (data.Categories.length > 0 && data2.Categories.length == 0) {
        const result = await db.query(
            `UPDATE category set name ='${name}' WHERE id = ${id}`
        );
        const newRows = await db.query(
            `SELECT * FROM category where id = '${id}'`
        );
        return {
            Category: helper.emptyOrRows(newRows), meta: result
        }
    } else {
        return {
            error: 'Duplicated category name or Id does not exist!'
        }
    }
}

module.exports = {
    getHotCategories,
    getCategories,
    getJavsByCategories,
    newCategory,
    getCategory,
    updateCategory
}