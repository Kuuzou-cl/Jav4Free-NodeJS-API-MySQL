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

async function listBucket() {
    let objectsS3 = [];
    let continuationToken;
    let continueWhile = true;

    while (continueWhile) {
        let filesS3 = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', ContinuationToken: continuationToken }).promise();
        objectsS3.push(...filesS3.Contents.map(file => file.Key));
        continuationToken = filesS3.NextContinuationToken;
        continueWhile = filesS3.IsTruncated;
    }

    let javObjects = [];

    for (let index = 0; index < objectsS3.length; index++) {
        if (objectsS3[index].includes('jav/')) {
            javObjects.push(objectsS3[index]);
        }
    }

    //sceneObjects.shift();

    return {
        Response: {
            objectsS3: objectsS3,
            javObjects: javObjects
        }
    }
}


module.exports = {
    listBucket
}