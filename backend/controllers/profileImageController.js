const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const ProfileImage = require('../models/profileImageModel');
const { S3_BUCKET_NAME } = process.env;

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function deleteOldImageFromS3(imageUrl) {
  if (imageUrl) {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const deleteParams = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
    };

    try {
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log('Old profile image deleted successfully:', fileName);
    } catch (error) {
      console.error('Error deleting old profile image from S3:', error);
    }
  }
}

exports.uploadProfileImage = [
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const { userId } = req.body;
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }

      const existingProfileImage = await ProfileImage.findOne({ where: { UserID: userId } });

      if (existingProfileImage && existingProfileImage.ImagePath) {
        await deleteOldImageFromS3(existingProfileImage.ImagePath);
      }

      const fileName = `${Date.now()}_${req.file.originalname}`;
      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      const imageUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      if (existingProfileImage) {
        existingProfileImage.ImagePath = imageUrl;
        await existingProfileImage.save();
      } else {
        await ProfileImage.create({ UserID: userId, ImagePath: imageUrl });
      }

      res.status(201).json({ message: 'Profile image uploaded successfully', imageUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

exports.getProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileImage = await ProfileImage.findOne({ where: { UserID: userId } });

    if (profileImage) {
      res.status(200).json(profileImage);
    } else {
      res.status(404).send('Profile image not found');
    }
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).send('Internal Server Error');
  }
};
