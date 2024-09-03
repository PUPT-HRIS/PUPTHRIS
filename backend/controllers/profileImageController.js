const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const ProfileImage = require('../models/profileImageModel');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', 
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `profile-pictures/${Date.now().toString()}-${file.originalname}`);
    }
  })
}).single('profileImage');

exports.uploadProfileImage = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ message: 'File upload failed.', error: err });
      }

      const { userID } = req.body;
      const imagePath = req.file.location;

      const newProfileImage = await ProfileImage.create({
        UserID: userID,
        ImagePath: imagePath
      });

      res.status(201).json(newProfileImage);
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getProfileImage = async (req, res) => {
  try {
    const { userID } = req.params;
    const profileImage = await ProfileImage.findOne({ where: { UserID: userID } });

    if (!profileImage) {
      return res.status(404).json({ message: 'Profile image not found.' });
    }

    res.status(200).json(profileImage);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteProfileImage = async (req, res) => {
  try {
    const { userID } = req.params;
    const profileImage = await ProfileImage.findOne({ where: { UserID: userID } });

    if (!profileImage) {
      return res.status(404).json({ message: 'Profile image not found.' });
    }

    const imagePath = profileImage.ImagePath;
    const s3Key = imagePath.split('.com/')[1];

    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    }).promise();

    await profileImage.destroy();

    res.status(200).json({ message: 'Profile image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).send('Internal Server Error');
  }
};
