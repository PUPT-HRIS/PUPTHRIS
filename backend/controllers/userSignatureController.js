const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3.config');
const UserSignatures = require('../models/userSignaturesModel');
const { S3_BUCKET_NAME } = process.env;

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function deleteOldImage(oldImageURL) {
  if (oldImageURL) {
    const urlParts = oldImageURL.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName
    };

    try {
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
      console.log('Old image deleted from S3:', fileName);
    } catch (err) {
      console.error('Error deleting old image from S3:', err);
    }
  }
}

exports.addUserSignature = [
  upload.single('signatureImage'),
  async (req, res) => {
    try {
      const { UserID } = req.body;

      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }

      const fileName = `${Date.now()}_${req.file.originalname}`;

      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const existingSignature = await UserSignatures.findOne({ where: { UserID } });

      if (existingSignature) {
        await deleteOldImage(existingSignature.SignatureImageURL);
        
        existingSignature.SignatureImageURL = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        await existingSignature.save();
        
        res.status(200).json(existingSignature);
      } else {
        const newUserSignature = await UserSignatures.create({
          UserID,
          SignatureImageURL: `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
        });
        
        res.status(201).json(newUserSignature);
      }
    } catch (error) {
      console.error('Error adding or updating user signature:', error);
      res.status(500).send('Internal Server Error');
    }
  },
];

exports.getUserSignature = async (req, res) => {
  try {
    const userId = req.params.id;
    const userSignature = await UserSignatures.findOne({ where: { UserID: userId } });

    if (userSignature) {
      res.status(200).json(userSignature);
    } else {
      res.status(404).send('User signature record not found');
    }
  } catch (error) {
    console.error('Error getting user signature:', error);
    res.status(500).send('Internal Server Error');
  }
};
