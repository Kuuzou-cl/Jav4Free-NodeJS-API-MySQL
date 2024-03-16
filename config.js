var fs = require("fs");

const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: 'jav-db-01-do-user-6590009-0.c.db.ondigitalocean.com',
    port: '25060',
    user: 'doadmin',
    password: 'AVNS_hD_ZI-eDih5rJnjp4t1',
    database: 'jav',
    ssl: {
      ca: fs.readFileSync(__dirname + '/ca-certificate.crt')
    }
  },
  cors: {
    server: [
      { origin: "*", credentials: false }
    ]
  },
  listPerPageJavs: 20,
  listPerPageScenes: 20,
  listPerPageIdols: 18
};
module.exports = config;