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
    secretAccessKey: '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',
});


async function getScenes() {
    try {
        const files = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'scenes-480/', MaxKeys: 5000 }).promise();
        const names = files.Contents.map(file => file.Key)
        return { success: true, data: names, files: files }
    } catch (error) {
        return { success: false, data: null, error: error }
    }
}

module.exports = {
    getScenes
}