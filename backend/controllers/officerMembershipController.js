const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const OfficershipMembership = require('../models/officerMembershipModel');
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

exports.addOfficershipMembership = [
  upload.single('proof'),
  async (req, res) => {
    try {
      const membershipData = req.body;

      if (req.file) {
        console.log(req.file);
        const proofUrl = await uploadFileToS3(req.file);
        membershipData.Proof = proofUrl;
        membershipData.ProofType = 'file';
      } else if (membershipData.Proof) {
        membershipData.ProofType = 'link';
      }

      const newMembership = await OfficershipMembership.create(membershipData);
      res.status(201).json(newMembership);
    } catch (error) {
      console.error('Error adding officership/membership:', error);
      res.status(500).send('Internal Server Error');
    }
  }
];

exports.updateOfficershipMembership = [
  upload.single('proof'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const membership = await OfficershipMembership.findOne({ where: { OfficershipMembershipID: id } });

      if (!membership) {
        return res.status(404).json({ error: 'Officership/Membership record not found' });
      }

      if (req.file) {
        if (membership.Proof && membership.ProofType === 'file') {
          const oldS3Key = membership.Proof.split('/').pop();
          const deleteParams = { Bucket: S3_BUCKET_NAME, Key: oldS3Key };
          await s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        const proofUrl = await uploadFileToS3(req.file);
        updates.Proof = proofUrl;
        updates.ProofType = 'file';
      } else if (updates.Proof && updates.Proof !== membership.Proof) {
        updates.ProofType = 'link';
      }

      const [updated] = await OfficershipMembership.update(updates, { where: { OfficershipMembershipID: id } });

      if (updated) {
        const updatedMembership = await OfficershipMembership.findOne({ where: { OfficershipMembershipID: id } });
        res.status(200).json({ membership: updatedMembership });
      } else {
        res.status(404).json({ error: 'Officership/Membership not found' });
      }
    } catch (err) {
      console.error('Error updating officership/membership:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
];

exports.getOfficershipMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await OfficershipMembership.findOne({ where: { OfficershipMembershipID: id } });

    if (membership) {
      res.status(200).json(membership);
    } else {
      res.status(404).send('Officership/Membership not found');
    }
  } catch (error) {
    console.error('Error getting officership/membership:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getOfficershipMembershipsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const memberships = await OfficershipMembership.findAll({ where: { UserID: userId } });

    if (memberships.length > 0) {
      res.status(200).json(memberships);
    } else {
      res.status(404).send('No officership/membership records found for this user');
    }
  } catch (error) {
    console.error('Error getting officership/memberships:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteOfficershipMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await OfficershipMembership.findOne({ where: { OfficershipMembershipID: id } });

    if (!membership) {
      return res.status(404).json({ error: 'Officership/Membership record not found' });
    }

    if (membership.Proof) {
      const s3Key = membership.Proof.split('/').pop();
      const deleteParams = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key
      };

      try {
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3Client.send(deleteCommand);
        console.log('File successfully deleted from S3:', s3Key);
      } catch (error) {
        console.error('Error deleting file from S3:', error);
        return res.status(500).json({ error: 'Failed to delete file from S3' });
      }
    }

    const result = await OfficershipMembership.destroy({ where: { OfficershipMembershipID: id } });

    if (result) {
      res.status(200).json({ message: 'Officership/Membership record and associated file deleted successfully' });
    } else {
      res.status(404).json({ error: 'Officership/Membership record not found' });
    }
  } catch (error) {
    console.error('Error deleting officership/membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
