const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : 'Waflek977kuu!',
        database : 'jav'
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