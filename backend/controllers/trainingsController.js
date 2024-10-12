const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Trainings = require('../models/trainingsModel');
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

exports.addTraining = [
  upload.fields([{ name: 'SupportingDocuments', maxCount: 1 }, { name: 'Proof', maxCount: 1 }]),
  async (req, res) => {
    try {
      const trainingData = req.body;

      if (req.files) {
        if (req.files.SupportingDocuments) {
          const supportingDocUrl = await uploadFileToS3(req.files.SupportingDocuments[0]);
          trainingData.SupportingDocuments = supportingDocUrl;
        }
        
        if (req.files.Proof) {
          const proofUrl = await uploadFileToS3(req.files.Proof[0]);
          trainingData.Proof = proofUrl;
          trainingData.ProofType = 'file';
        }
      }

      if (trainingData.Proof && !req.files?.Proof) {
        trainingData.ProofType = 'link';
      }

      const newTraining = await Trainings.create(trainingData);
      res.status(201).json(newTraining);
    } catch (error) {
      console.error('Error adding training:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

exports.updateTraining = [
  upload.fields([{ name: 'SupportingDocuments', maxCount: 1 }, { name: 'Proof', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const existingTraining = await Trainings.findOne({ where: { TrainingID: id } });
      if (!existingTraining) {
        return res.status(404).send('Training not found');
      }

      if (req.files) {
        if (req.files.SupportingDocuments) {
          if (existingTraining.SupportingDocuments) {
            const oldS3Key = existingTraining.SupportingDocuments.split('/').pop();
            const deleteParams = { Bucket: S3_BUCKET_NAME, Key: oldS3Key };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
          }
          const supportingDocUrl = await uploadFileToS3(req.files.SupportingDocuments[0]);
          updates.SupportingDocuments = supportingDocUrl;
        }
        
        if (req.files.Proof) {
          if (existingTraining.Proof && existingTraining.ProofType === 'file') {
            const oldS3Key = existingTraining.Proof.split('/').pop();
            const deleteParams = { Bucket: S3_BUCKET_NAME, Key: oldS3Key };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
          }
          const proofUrl = await uploadFileToS3(req.files.Proof[0]);
          updates.Proof = proofUrl;
          updates.ProofType = 'file';
        }
      }

      if (updates.Proof && !req.files?.Proof) {
        updates.ProofType = 'link';
      }

      const [updated] = await Trainings.update(updates, {
        where: { TrainingID: id }
      });

      if (updated) {
        const updatedTraining = await Trainings.findOne({ where: { TrainingID: id } });
        res.status(200).json({ training: updatedTraining });
      } else {
        res.status(404).send('Training not found');
      }
    } catch (err) {
      console.error('Error updating training:', err);
      res.status(500).send('Internal Server Error');
    }
  }
];

exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Trainings.findOne({ where: { TrainingID: id } });
    
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }

    if (training.SupportingDocuments) {
      const s3Key = training.SupportingDocuments.split('/').pop();
      const deleteParams = { Bucket: S3_BUCKET_NAME, Key: s3Key };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    if (training.Proof && training.ProofType === 'file') {
      const s3Key = training.Proof.split('/').pop();
      const deleteParams = { Bucket: S3_BUCKET_NAME, Key: s3Key };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    await training.destroy();
    res.status(200).json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Trainings.findOne({ where: { TrainingID: id } });
    if (training) {
      res.status(200).json(training);
    } else {
      res.status(404).send('Training not found');
    }
  } catch (error) {
    console.error('Error getting training:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getTrainingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainings = await Trainings.findAll({ where: { UserID: userId } });
    if (trainings.length > 0) {
      res.status(200).json(trainings);
    } else {
      res.status(404).send('No trainings found for this user');
    }
  } catch (error) {
    console.error('Error getting trainings:', error);
    res.status(500).send('Internal Server Error');
  }
};