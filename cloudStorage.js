const AWS = require('aws-sdk');

// Configuration de AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Fonction pour télécharger un fichier sur S3
async function uploadFile(file, bucketName) {
    const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file.data,
        ContentType: file.mimetype,
    };

    return s3.upload(params).promise();
}

// Fonction pour obtenir un URL de fichier depuis S3
function getFileUrl(bucketName, fileKey) {
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

module.exports = {
    uploadFile,
    getFileUrl
};