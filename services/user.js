const db = require('./db');
const helper = require('../helper');
const jwt = require('jsonwebtoken');

async function login(email, password) {
    const rows = await db.query(
        `SELECT * FROM jav.user WHERE email = '${email}' and pswd = AES_ENCRYPT('${password}', 'syny')`
    );
    const data = helper.emptyOrRows(rows);
    if (data[0]) {
        const token = jwt.sign({
            username: data[0].email,
            userId: data[0].id,
            userAdmin: data[0].admin
        },
            'syny', {
            expiresIn: '7d'
        })
        return {
            user: data[0].email,
            token: token
        }
    } else {
        return { error: 'error' };
    }
}

async function register(email, password) {
    const rows = await db.query(
        `SELECT * FROM jav.user WHERE email = '${email}'`
    );
    const data = helper.emptyOrRows(rows);
    if (!data[0]) {
        const rowsRegister = await db.query(        
            `INSERT INTO jav.user (email, pswd) VALUES('${email}', AES_ENCRYPT('${password}', 'syny'))`
        );
        const rowsUser = await db.query(
            `SELECT * FROM jav.user WHERE email = '${email}'`
        );
        const dataUser = helper.emptyOrRows(rowsUser);
        const token = jwt.sign({
            username: dataUser[0].email,
            userId: dataUser[0].id,
            userAdmin: dataUser[0].admin
        },
            'syny', {
            expiresIn: '7d'
        })
        return {
            user: dataUser[0].email,
            token: token
        }
    } else {
        return { error: 'Email already exist' };
    }
}

async function tokenAlive(email, token) {
    try {
        var decoded = jwt.verify(token, 'syny');
        if (decoded.username == email) {
            return { alive: true, data: decoded };
        } else {
            return { alive: false, error: 'No match found! or your token has expired' };
        }
    } catch (error) {
        return { alive: false, error: error };
    }
}



module.exports = {
    login,
    register,
    tokenAlive
}