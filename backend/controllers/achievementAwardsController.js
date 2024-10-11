const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const AchievementAward = require('../models/achievementAwardsModel');
const { S3_BUCKET_NAME } = process.env;

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFileToS3 = async (file) => {
  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log('File successfully uploaded to S3:', fileName);
    return `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

exports.addAchievementAward = [
  upload.single('proof'),
  async (req, res) => {
    try {
      const achievementData = req.body; 


      if (req.file) {
        const proofUrl = await uploadFileToS3(req.file);
        achievementData.Proof = proofUrl;
        achievementData.ProofType = 'file';
      } else if (achievementData.Proof) {
        achievementData.ProofType = 'link';
      }

      const newAchievement = await AchievementAward.create(achievementData);
      return res.status(201).json(newAchievement);
    } catch (error) {
      console.error('Error adding achievement award:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
];

exports.updateAchievementAward = [
  upload.single('proof'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const achievement = await AchievementAward.findOne({ where: { AchievementID: id } });

      if (!achievement) {
        return res.status(404).json({ error: 'Achievement record not found' });
      }

      if (req.file) {
        if (achievement.Proof && achievement.ProofType === 'file') {
          const oldS3Key = achievement.Proof.split('/').pop();
          const deleteParams = { Bucket: S3_BUCKET_NAME, Key: oldS3Key };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        const proofUrl = await uploadFileToS3(req.file);
        updates.Proof = proofUrl;
        updates.ProofType = 'file';
      } else if (updates.Proof && updates.Proof !== achievement.Proof) {
        updates.ProofType = 'link';
      }

      const [updated] = await AchievementAward.update(updates, { where: { AchievementID: id } });

      if (updated) {
        const updatedAchievement = await AchievementAward.findOne({ where: { AchievementID: id } });
        res.status(200).json({ achievement: updatedAchievement });
      } else {
        res.status(404).json({ error: 'Achievement not found or no changes made' });
      }
    } catch (error) {
      console.error('Error updating achievement award:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

exports.getAchievementAward = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await AchievementAward.findOne({ where: { AchievementID: id } });

    if (achievement) {
      res.status(200).json(achievement);
    } else {
      res.status(404).send('Achievement award not found');
    }
  } catch (error) {
    console.error('Error getting achievement award:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAchievementAwardsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await AchievementAward.findAll({ where: { UserID: userId } });

    if (achievements.length > 0) {
      return res.status(200).json(achievements);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching achievement awards:', error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.deleteAchievementAward = async (req, res) => {
  try {
    const { id } = req.params;
    const achievement = await AchievementAward.findOne({ where: { AchievementID: id } });

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement record not found' });
    }

    if (achievement.Proof && achievement.ProofType === 'file') {
      const s3Key = achievement.Proof.split('/').pop();
      const deleteParams = { Bucket: S3_BUCKET_NAME, Key: s3Key };
      try {
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log('File successfully deleted from S3:', s3Key);
      } catch (error) {
        console.error('Error deleting file from S3:', error);
        // Continue with deletion even if S3 deletion fails
      }
    }

    const result = await AchievementAward.destroy({ where: { AchievementID: id } });

    if (result) {
      res.status(200).json({ message: 'Achievement award deleted successfully' });
    } else {
      res.status(404).json({ error: 'Achievement record not found' });
    }
  } catch (error) {
    console.error('Error deleting achievement award:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
