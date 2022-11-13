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


async function getAll() {
    try {

        const rows = await db.query(
            `select * from Scene s`
        );
        const data = helper.emptyOrRows(rows);

        data.forEach(row => {
            row.video720p = false;
            row.video480p = false;
            row.videoStatic = false;
            row.videoPreview = false;
            row.videoSprite = false;
            row.videoVtt = false;
        });

        const files720p = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'scenes/', MaxKeys: 100000 }).promise();
        const names720p = files720p.Contents.map(file => file.Key);
        names720p.shift();
        const files480p = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'scenes_480/', MaxKeys: 100000 }).promise();
        const names480p = files480p.Contents.map(file => file.Key);
        names480p.shift();
        const filesStatic = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'scenes-static/', MaxKeys: 100000 }).promise();
        const namesStatic = filesStatic.Contents.map(file => file.Key);
        namesStatic.shift();
        const filesPreview = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'scenes-preview/', MaxKeys: 100000 }).promise();
        const namesPreview = filesPreview.Contents.map(file => file.Key);
        namesPreview.shift();
        const filesSprite = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'sprites/', MaxKeys: 100000 }).promise();
        const namesSprite = filesSprite.Contents.map(file => file.Key);
        namesSprite.shift();
        const filesVtts = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'vtts/', MaxKeys: 100000 }).promise();
        const namesVtts = filesVtts.Contents.map(file => file.Key);
        namesVtts.shift();


        data.forEach(row => {
            for (let index = 0; index < names720p.length; index++) {
                if ("scenes/" + row.code + ".mp4" == names720p[index]) {
                    row.video720p = true;
                    break;
                }
            }
            for (let index = 0; index < names480p.length; index++) {
                if ("scenes_480/" + row.code + "_1.mp4" == names480p[index]) {
                    row.video480p = true;
                    break;
                }
            }
            for (let index = 0; index < namesStatic.length; index++) {
                if ("scenes-static/" + row.code + "-static.jpg" == namesStatic[index]) {
                    row.videoStatic = true;
                    break;
                }
            }
            for (let index = 0; index < namesPreview.length; index++) {
                if ("scenes-preview/" + row.code + ".mp4" == namesPreview[index]) {
                    row.videoPreview = true;
                    break;
                }
            }
            for (let index = 0; index < namesSprite.length; index++) {
                if ("sprites/" + row.code + "_sprite.jpg" == namesSprite[index]) {
                    row.videoSprite = true;
                    break;
                }
            }
            for (let index = 0; index < namesVtts.length; index++) {
                if ("vtts/" + row.code + "_thumbs.vtt" == namesVtts[index]) {
                    row.videoVtt = true;
                    break;
                }
            }
        });


        return { success: true, data: data }
    } catch (error) {
        return { success: false, data: null, error: error }
    }
}

async function getAllNotDB() {
    try {

        const dataJ = [];

        const rowsJavs = await db.query(
            `select code from Jav j`
        );
        const dataJavs = helper.emptyOrRows(rowsJavs);

        const filesJavs = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'javs/', MaxKeys: 100000 }).promise();
        const namesJavs = filesJavs.Contents.map(file => file.Key);
        namesJavs.shift();

        for (let index = 0; index < namesJavs.length; index++) {            
            if (dataJavs.some(item => ("javs/" +item.code + ".jpg") === namesJavs[index])) {
                dataJ.push({file: namesJavs[index], state: true});
            }else{
                dataJ.push({file: namesJavs[index], state: false});
            }
        }

        const dataS = [];

        const rowsScenes = await db.query(
            `select code from Scene s`
        );
        const dataScenes = helper.emptyOrRows(rowsScenes);

        const filesScenes = await s3.listObjectsV2({ Bucket: 'jav4free-s3-data', Prefix: 'scenes/', MaxKeys: 100000 }).promise();
        const namesScenes = filesScenes.Contents.map(file => file.Key);
        namesScenes.shift();

        for (let index = 0; index < namesScenes.length; index++) {            
            if (dataScenes.some(item => ("scenes/" +item.code + ".mp4") === namesScenes[index])) {
                dataS.push({file: namesScenes[index], state: true});
            }else{
                dataS.push({file: namesScenes[index], state: false});
            }
        }

        return { success: true, dataJavs:dataJ, dataScenes: dataS }
    } catch (error) {
        return { success: false, data: null, error: error }
    }
}

module.exports = {
    getAll,
    getAllNotDB
}