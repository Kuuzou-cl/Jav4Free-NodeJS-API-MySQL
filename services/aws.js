const db = require('./db');
const helper = require('../helper');
const config = require('../config');
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

AWS.config.update({
    region: "us-east-1",
    accessKeyId: 'AKIATFEAPAONSNFVTAEW',
    secretAccessKey: '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'
});

const s3 = new AWS.S3();

const BUCKET_NAME = 'jav4free-s3-data';

// List All Files Names from S3
const listFiles = async () => {
    try {
        const files = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
        const names = files.Contents.map(file => file.Key)
        return { success: true, data: names }
    } catch (error) {
        return { success: false, data: null }
    }
}

export {
    listFiles
}