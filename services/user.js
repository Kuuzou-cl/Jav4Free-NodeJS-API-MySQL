const db = require('./db');
const helper = require('../helper');
const jwt = require('jsonwebtoken');

async function login(email, password) {
    const rows = await db.query(
        `SELECT * FROM user WHERE email = '${email}' and pswd = AES_ENCRYPT('${password}', 'syny')`
    );
    const data = helper.emptyOrRows(rows);
    if (data[0]) {
        const token = jwt.sign({
            username: data[0].email,
            userId: data[0].id
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
    tokenAlive
}