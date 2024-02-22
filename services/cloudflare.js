const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const aws = require('aws-sdk')
//var multer = require('multer')
//var multerS3 = require('multer-s3')

const spacesEndpoint = new aws.Endpoint('https://70e8c8aff115acf6bcc8cd9998cdda6e.r2.cloudflarestorage.com');
//token value _B7GPHejZOyu3Nkp3FmBQWMvIAGDEZobnPRT7mQE
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: '6f35d27b7c9d0b3285c72a4f3eac6477',
    secretAccessKey: 'ac2ff2089de6bd3c1a3ad1e8b803276dbf43513417cb1780130200840d33b823',
});

async function listBucket() {
    let objectsS3 = [];
    let continuationToken;
    let continueWhile = true;

    while (continueWhile) {
        let filesS3 = await s3.listObjectsV2({ Bucket: 'jav', ContinuationToken: continuationToken }).promise();
        objectsS3.push(...filesS3.Contents.map(file => file.Key));
        continuationToken = filesS3.NextContinuationToken;
        continueWhile = filesS3.IsTruncated;
    }

    let javObjects = [];

    for (let index = 0; index < objectsS3.length; index++) {
        if (objectsS3[index].includes('.mp4') && !objectsS3[index].includes('-preview')) {
            javObjects.push(objectsS3[index]);
        }
    }

    let rows = await db.query(
        `select j.code from jav.jav j`
    );

    rows = helper.emptyOrRows(rows);

    let javNotIncluded = [];

    for (let index = 0; index < javObjects.length; index++) {
        let code = javObjects[index].split('/');
        if (!rows.some(item => item.code === code[0])) {
            javNotIncluded.push(javObjects[index].split('/'));
        }
    }

    //sceneObjects.shift();

    return {
        Response: {
            javObjects: javNotIncluded
        }
    }
}


module.exports = {
    listBucket
}