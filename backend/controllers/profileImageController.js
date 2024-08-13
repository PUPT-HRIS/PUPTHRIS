const multer = require('multer');
const path = require('path');
const ProfileImage = require('../models/ProfileImage');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const imagePath = req.file.path;

    const newProfileImage = await ProfileImage.create({
      UserID: userId,
      ImagePath: imagePath,
    });

    res.status(201).json({ message: 'Profile image uploaded successfully', image: newProfileImage });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getProfileImage = async (req, res) => {
    try {
      const userId = req.params.id;
      const profileImage = await ProfileImage.findOne({
        where: { UserID: userId },
        attributes: ['ImagePath']
      });
  
      if (profileImage && profileImage.ImagePath) {
        res.sendFile(path.resolve(profileImage.ImagePath));
      } else {
        res.status(404).send('Profile image not found');
      }
    } catch (error) {
      console.error('Error retrieving profile image:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  