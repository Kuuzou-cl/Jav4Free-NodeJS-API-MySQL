const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

const spacesEndpoint = new aws.Endpoint('s3.amazonaws.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'AKIATFEAPAONSNFVTAEW',
    secretAccessKey: '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'
});

async function getAll() {
    var files = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'jav4free-s3-data',
            acl: 'public-read',
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                cb(null, file.originalname)
            }
        })
    })

    var data = files.array('file',99);

    return {
        data,
        files
    }
}

module.exports = {
    getAll
}