const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
        host     : 'j4f-db.c4oajpzrzl5x.us-east-1.rds.amazonaws.com',
        port     : '3306',
        user     : 'admin',
        password : 'Waflek977kuu!',
        database : 'shurima'
    },
    cors: {
      server : [
        {origin : "*", credentials : true}
      ]
    },
    listPerPageJavs: 12,
    listPerPageScenes: 20,
    listPerPageIdols: 18
  };
  module.exports = config;