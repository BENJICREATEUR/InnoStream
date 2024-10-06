const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

class S3Service {
    // Télécharger un fichier sur S3
    static async uploadFile(file) {
        const fileName = `${uuidv4()}-${file.originalname}`;
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read', // Pour rendre le fichier accessible publiquement
        };

        try {
            const uploadResult = await s3.upload(params).promise();
            return uploadResult.Location; // URL du fichier téléchargé
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw error;
        }
    }

    // Supprimer un fichier de S3
    static async deleteFile(fileName) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
        };

        try {
            await s3.deleteObject(params).promise();
            return { message: 'File deleted successfully' };
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            throw error;
        }
    }

    // Récupérer un fichier de S3
    static async getFile(fileName) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
        };

        try {
            const file = await s3.getObject(params).promise();
            return file.Body; // Retourne le contenu du fichier
        } catch (error) {
            console.error('Error retrieving file from S3:', error);
            throw error;
        }
    }
}

module.exports = S3Service;